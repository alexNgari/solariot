#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include <time.h>
#include <sys/time.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event_loop.h"

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"
#include "freertos/event_groups.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"
#include "driver/gpio.h"
#include "lwip/err.h"
#include "lwip/apps/sntp.h"


#include "esp_log.h"
#include "mqtt_client.h"
#include "timer_main.h"
#include "sntp_main.h"

static const char *TAG = "SOLAR_MQTT";


void* mqtt_event_group;
const static int MQTT_CONNECTED_BIT = BIT1;
const static int MQTT_PUBLISHED_BIT = BIT2;
esp_mqtt_client_handle_t client;

char* on_command = "ON";
char* off_command = "OFF";

static esp_err_t mqtt_event_handler(esp_mqtt_event_handle_t event)
{
    esp_mqtt_client_handle_t eventClient = event->client;
    int msg_id;
    // your_context_t *context = event->context;
    switch (event->event_id) {
        case MQTT_EVENT_CONNECTED:
            xEventGroupSetBits(mqtt_event_group, MQTT_CONNECTED_BIT);
            ESP_LOGI(TAG, "MQTT_EVENT_CONNECTED");
            msg_id = esp_mqtt_client_subscribe(eventClient, "ax/cd/heater", 1);
            ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

            // msg_id = esp_mqtt_client_subscribe(eventClient, "/topic/qos1", 1);
            // ESP_LOGI(TAG, "sent subscribe successful, msg_id=%d", msg_id);

            // msg_id = esp_mqtt_client_unsubscribe(eventClient, "/topic/qos1");
            // ESP_LOGI(TAG, "sent unsubscribe successful, msg_id=%d", msg_id);
            break;
        case MQTT_EVENT_DISCONNECTED:
            xEventGroupClearBits(mqtt_event_group, MQTT_CONNECTED_BIT);
            ESP_LOGI(TAG, "MQTT_EVENT_DISCONNECTED");
            break;

        case MQTT_EVENT_SUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
            // msg_id = esp_mqtt_client_publish(eventClient, "ax/dt", "data", 4, 0, 0);
            // ESP_LOGI(TAG, "sent publish successful, msg_id=%d", msg_id);
            break;
        case MQTT_EVENT_UNSUBSCRIBED:
            ESP_LOGI(TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_PUBLISHED:
            ESP_LOGI(TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
            break;
        case MQTT_EVENT_DATA:
            ESP_LOGI(TAG, "MQTT_EVENT_DATA");
            ESP_LOGI(TAG, "TOPIC=%.*s\r", event->topic_len, event->topic);
            ESP_LOGI(TAG, "DATA=%.*s\r", event->data_len, event->data);
            char* data = event->data;
            if (strncmp(on_command, data, 2) == 0){
                ESP_LOGI(TAG, "Turning on the Relay");
                gpio_set_level(23, 1);
            } else if (strncmp(off_command, data, 3) == 0){
                ESP_LOGI(TAG, "Turning off the Relay");
                gpio_set_level(23, 0);
            } else {
                ESP_LOGI(TAG, "Invalid command");
            }
            break;
        case MQTT_EVENT_ERROR:
            ESP_LOGI(TAG, "MQTT_EVENT_ERROR");
            break;
        default:
            ESP_LOGI(TAG, "Other event id:%d", event->event_id);
            break;
    }
    return ESP_OK;
}

void mqtt_app_start(void)
{
    const esp_mqtt_client_config_t mqtt_cfg = {
        .host = "35.184.67.60",
        .port = 1883,
        .event_handle = mqtt_event_handler,
        .username = "mssrt_cli_1",
        .password = "asdfghjkl",
        // .user_context = (void *)your_context
    };

    mqtt_event_group = xEventGroupCreate();

    client = esp_mqtt_client_init(&mqtt_cfg);
    esp_mqtt_client_start(client);
    xEventGroupWaitBits(mqtt_event_group, MQTT_CONNECTED_BIT, false, true, portMAX_DELAY);

    // Setup pin for relay control
    gpio_pad_select_gpio(23);
    gpio_set_direction(23, GPIO_MODE_OUTPUT);
}

int64_t xx_time_get_time() {
	struct timeval tv;
	gettimeofday(&tv, NULL);
	return (tv.tv_sec * 1000LL + (tv.tv_usec / 1000LL));
}

void task_send_data(void* data){
    int *parametersArray = (int*) data;

    uint64_t* totalPulseCountPtr = (uint64_t*) *parametersArray;
    uint16_t* sourceVoltagePtr = (uint16_t*) *(parametersArray+1);
    uint16_t* sourceCurrentPtr = (uint16_t*) *(parametersArray+2);
    uint16_t* temperaturePtr = (uint16_t*) *(parametersArray+3);

    char stringToSend[200];
    // double my_time;
    // time_t now;

    int64_t timenow;

    while(1){
        // ESP_LOGI(TAG, "Waiting for connection...");
        // get_timer_value(&my_time);
        xEventGroupWaitBits(mqtt_event_group, MQTT_CONNECTED_BIT, false, true, portMAX_DELAY);
        
        float voltage = *sourceVoltagePtr;
        voltage = voltage/1253;
        float current = *sourceCurrentPtr;
        current = (current - 2400)/125;
        float temperature = *temperaturePtr;
        temperature = temperature / 12.5;   // 1 degree yields 10mV == 12.5 adc ticks
        // time(&now);
        timenow = xx_time_get_time();

        snprintf(stringToSend, 200, "v:%f,i:%f,temp:%f,flow:%llu,t:%llu", voltage, current, temperature, *totalPulseCountPtr, timenow);
        
        esp_mqtt_client_publish(client, "ax/dt", stringToSend, strlen(stringToSend), 0, 1);

        xEventGroupSetBits(mqtt_event_group, MQTT_PUBLISHED_BIT);
        ESP_LOGI(TAG, "DATA_SENT:: v:%f,i:%f,temp:%f,flow:%llu,t:%llu", voltage, current, temperature, *totalPulseCountPtr, timenow);
        vTaskDelay(1000/portTICK_PERIOD_MS);
    }
    vTaskDelete(NULL);
}