#include <stdio.h>
#include <stdlib.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "driver/gpio.h"
#include "driver/adc.h"
#include "esp_adc_cal.h"
#include "esp_log.h"
#include "mqtt_main.h"

#include "freertos/event_groups.h"

#define DEFAULT_VREF    1100        //Use adc2_vref_to_gpio() to obtain a better estimate
#define NO_OF_SAMPLES   64          //Multisampling
static const char *TAG = "SOLAR_ADC";
static esp_adc_cal_characteristics_t *adc_chars;
int channel = 4;     //GPIO34 if ADC1, GPIO14 if ADC2
static const adc_atten_t atten = ADC_ATTEN_DB_11;
static const adc_unit_t unit = ADC_UNIT_1;

static void check_efuse()
{
    //Check TP is burned into eFuse
    if (esp_adc_cal_check_efuse(ESP_ADC_CAL_VAL_EFUSE_TP) == ESP_OK) {
        printf("eFuse Two Point: Supported\n");
    } else {
        printf("eFuse Two Point: NOT supported\n");
    }

    //Check Vref is burned into eFuse
    if (esp_adc_cal_check_efuse(ESP_ADC_CAL_VAL_EFUSE_VREF) == ESP_OK) {
        printf("eFuse Vref: Supported\n");
    } else {
        printf("eFuse Vref: NOT supported\n");
    }
}

static void print_char_val_type(esp_adc_cal_value_t val_type)
{
    if (val_type == ESP_ADC_CAL_VAL_EFUSE_TP) {
        printf("Characterized using Two Point Value\n");
    } else if (val_type == ESP_ADC_CAL_VAL_EFUSE_VREF) {
        printf("Characterized using eFuse Vref\n");
    } else {
        printf("Characterized using Default Vref\n");
    }
}

void initialise_adc(uint16_t* adc_reading1, uint16_t *adc_reading2, uint16_t *adc_reading3)
{
    //Check if Two Point or Vref are burned into eFuse
    check_efuse();

    //Configure ADC
    if (unit == ADC_UNIT_1) {
        adc1_config_width(ADC_WIDTH_BIT_12);
        while (channel < 7){
            adc1_config_channel_atten(channel, atten);
            channel  = channel + 1;
        }
    } else {
        adc2_config_channel_atten((adc2_channel_t)channel, atten);
    }

    //Characterize ADC
    adc_chars = calloc(1, sizeof(esp_adc_cal_characteristics_t));
    esp_adc_cal_value_t val_type = esp_adc_cal_characterize(unit, atten, ADC_WIDTH_BIT_12, DEFAULT_VREF, adc_chars);
    print_char_val_type(val_type);

    //Continuously sample ADCs
    while (1) {

        channel = 0;
        ESP_LOGD(TAG, "Waiting for previous data to be published");
        xEventGroupWaitBits(mqtt_event_group, MQTT_PUBLISHED_BIT, true, true, portMAX_DELAY);
        while (channel < 7){
            if (channel == 0){
                *adc_reading1 = adc1_get_raw((adc1_channel_t)channel);
            }
            else if (channel == 5){
                *adc_reading2 = adc1_get_raw((adc1_channel_t)channel);
            }
            else if (channel == 6){
                *adc_reading3 = adc1_get_raw((adc1_channel_t)channel);
            }
            
            channel = channel + 1;
            vTaskDelay(5/portTICK_PERIOD_MS);
        }
        

        // uint32_t voltage = esp_adc_cal_raw_to_voltage(*adc_reading, adc_chars);
        ESP_LOGD(TAG, "Voltage: %d\tCurrent: %d\tTemperature: %d\n", *adc_reading1, *adc_reading2, *adc_reading3);
        vTaskDelay(pdMS_TO_TICKS(90));
    }
}
