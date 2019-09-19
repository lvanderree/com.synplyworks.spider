'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
var ClientManager = require("../../lib/clientManager");

class Fan extends Homey.Device {
	
	onInit() {
		this.log('Initializing Itho Fan');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
		this.log('Data:', this.getData());

		const settings = this.getSettings();

		const client = new Client["default"](settings.username, settings.password);
		const cm = new ClientManager["default"](client);

		// init fan_speed to current speed
		cm.getSpiderWithFan().then(spider => {
			const fanSpeed = spider.properties.find(p => p.id === 'FanSpeed');

			console.log('retreived current fan_speed of '+this.getName(), fanSpeed);
			this.setCapabilityValue('fan_speed', Number(fanSpeed.status));
		});

		// register a capability listener
		this.registerCapabilityListener('fan_speed', async (value) => {
			console.log('adjusting fanSpeed...');
			
			cm.getSpiderWithFan().then(spider => {
				cm.setFanSpeed(spider, value).then(device => {
					console.log('updated fanSpeed to: ', device.properties[2]);
				})
			});

		});
	}
	
}
module.exports = Fan;