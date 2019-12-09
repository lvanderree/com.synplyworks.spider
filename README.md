# Spider

control your Itho Daalderop Spiders via the **Itho Daalderop gateway** ***Required***

## How does it work?

* Install the app
* Add new devices to Homey, and select Spider
* Choose if you want to add the Spider Thermostats or the Itho Fan
* Provide your mijn.ithodaalderop.nl username + password
* Wait for the api to show your Spiders and add them
* Now control your device via Homey 

## Features

Current features that are implemented:

* login at the mijn.ithodaalderop.nl api
* get the available devices
* find the spiders
* control the fan via Homey
* read out and control the thermostat (temperature and operation mode) via Homey
* refresh every 5 minutes
* see data at insights
* use your devices in flows (Please notes, because of the polling interval it can take up to 5 minutes before the state is updated)

## TODO’s

features on the wishlist:

* improve widgets layout
* add thermostat property: "itho_override_end_time"
* reauthenticate when token is expired
* implemented the connected smartmeter

## Version

* 0.4.2 fixed several new athom publish rules
* 0.4.1 fixed a bug with actions in flows
* 0.4.0 added several flows
* 0.3.9 applied new athom rules for donating
* 0.3.8 fixed and added capabilities "thermostat_mode", "itho_zone_demand" and "itho_override_mode"
* 0.3.0 implemented refresh functionality; fixed some bugs; Use icons of Itho
* 0.2.2 updated images
* 0.2.1 fixed path to spider images
* 0.2.0 added support for spider thermostat
* 0.1.1 fixed some app metadata
* 0.1.0 initial release to control itho fan
