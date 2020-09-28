#include <stdio.h>
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#include "esp_wifi.h"
#include "esp_system.h"
#include "nvs_flash.h"
#include "esp_event_loop.h"
#include <time.h>
#include <sys/time.h>

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/semphr.h"
#include "freertos/queue.h"
#include "freertos/event_groups.h"

#include "lwip/sockets.h"
#include "lwip/dns.h"
#include "lwip/netdb.h"
#include"driver/gpio.h"
#include "lwip/err.h"
#include "lwip/apps/sntp.h"


#include "esp_log.h"
#include "mqtt_client.h"
#include <sdkconfig.h>


#include "mqtt_main.h"
#include "wifi_main.h"
#include "pulse_counter.h"
#include "adc_main.h"
#include "timer_main.h"
#include "sntp_main.h"

static const char *TAG = "MQTT_SOLAR";

RTC_DATA_ATTR static int boot_count = 0;


uint64_t totalPulseCount = 0;
uint16_t sourceVoltage = 0;
uint16_t sourceCurrent = 0;
uint16_t temperature = 0;

time_t now;

void set_log_level_verbose();

// int64_t xx_time_get_time() {
// 	struct timeval tv;
// 	gettimeofday(&tv, NULL);
// 	return (tv.tv_sec * 1000LL + (tv.tv_usec / 1000LL));
// }

void app_main()
{    
    ++boot_count;
    ESP_LOGI(TAG, "Boot count: %d", boot_count);

    int mqttParametersArray[] = {(int)&totalPulseCount, (int)&sourceVoltage, (int)&sourceCurrent, (int)&temperature};

    int64_t timenow;

    ESP_LOGI(TAG, "[APP] Startup..");
    ESP_LOGI(TAG, "[APP] Free memory: %d bytes", esp_get_free_heap_size());
    ESP_LOGI(TAG, "[APP] IDF version: %s", esp_get_idf_version());

    set_log_level_verbose();

    nvs_flash_init();
    wifi_init();
    sntp_main_func(&now);
    mqtt_app_start();
    // vTaskDelay(10000/portTICK_PERIOD_MS);
    
    // timenow = xx_time_get_time();
    // ESP_LOGI(TAG, "The time variable reads: %llu", timenow);

    // // solar_timer_init();

    xTaskCreate(&counter_run, "Waterflow_counter", 2048, (void*)&totalPulseCount, 2, NULL);


    xTaskCreate(&task_send_data, "MQTT_Send", 20480, (void*)mqttParametersArray, 2, NULL);


    initialise_adc(&sourceVoltage, &sourceCurrent, &temperature);
}


//////////////////// FUNCTION DEFINITIONS //////////////////////////////

void set_log_level_verbose(){
    esp_log_level_set("*", ESP_LOG_INFO);
    esp_log_level_set("MQTT_CLIENT", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT_TCP", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT_SSL", ESP_LOG_VERBOSE);
    esp_log_level_set("TRANSPORT", ESP_LOG_VERBOSE);
    esp_log_level_set("OUTBOX", ESP_LOG_VERBOSE);
}

