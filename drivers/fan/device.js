'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
var ClientManager = require("../../lib/clientManager");


class MyDevice extends Homey.Device {
	
	onInit() {
		this.fanspeed = "Auto";

		this.log('MyDevice has been inited');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());

		const settings = this.getSettings();

		const client = new Client["default"](settings.username, settings.password);
		const cm = new ClientManager["default"](client);

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

module.exports = MyDevice;