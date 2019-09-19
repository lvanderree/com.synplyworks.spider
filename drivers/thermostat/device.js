'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
var ClientManager = require("../../lib/clientManager");

class Thermostat extends Homey.Device {
	
	onInit() {
		this.log('Initializing Spider Thermostat');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
		this.log('Data:', this.getData());

		const settings = this.getSettings();

		const client = new Client["default"](settings.username, settings.password);
		const cm = new ClientManager["default"](client);

		// init target_temperature to current temperature
		cm.getSpider(this.getData()['id']).then(spider => {
			const SetpointTemperature = spider.properties.find(p => p.id === 'SetpointTemperature');
			console.log('retreived current target_temperature of '+this.getName(), SetpointTemperature);
			this.setCapabilityValue('target_temperature', Number(SetpointTemperature.status));

			const AmbientTemperature = spider.properties.find(p => p.id === 'AmbientTemperature');
			console.log('retreived current temperature at '+this.getName(), AmbientTemperature);
			this.setCapabilityValue('measure_temperature', Number(AmbientTemperature.status));

			const OperationMode = spider.properties.find(p => p.id === 'OperationMode' );
			console.log('retreived current opreation mode at '+this.getName(), OperationMode);
			this.setCapabilityValue('thermostat_mode', OperationMode.status.toLowerCase());

		});

		// register a capability listener
		this.registerCapabilityListener('target_temperature', async (value) => {
			console.log('adjusting target_temperature at ' + this.getName(), value);
			
			cm.getSpider(this.getData()['id']).then(spider => {
				cm.setTargetTemperature(spider, value).then(device => {
					console.log('updated temperature at ' + this.getName() + ' to: ', device);
				});
			});
		});

		this.registerCapabilityListener('thermostat_mode', async (value) => {
			console.log('adjusting thermostat_mode at ' + this.getName(), value);
			
			cm.getSpider(this.getData()['id']).then(spider => {
				cm.setOperationMode(spider, value).then(device => {
					console.log('updated operation mode at ' + this.getName() + ' to: ', device);
				});
			});
		});
	}

}
module.exports = Thermostat;