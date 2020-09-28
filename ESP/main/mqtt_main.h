#ifndef _MQTT_MAIN_H_
#define _MQTT_MAIN_H_

void mqtt_app_start(void);
void* mqtt_event_group;
const static int MQTT_CONNECTED_BIT = BIT1;
const static int MQTT_PUBLISHED_BIT = BIT2;
void task_send_data(void* data);

#endif
