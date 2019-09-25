'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
var ClientManager = require("../../lib/clientManager");

const POLL_INTERVAL = 1000 * 60 * 5; // 5 min

class Fan extends Homey.Device {
	
	onInit() {
		this.log('Initializing Itho Fan');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
		this.log('Data:', this.getData());

		const settings = this.getSettings();

		const client = new Client["default"](settings.username, settings.password);
		this.cm = new ClientManager["default"](client);

		// init fan_speed to current speed
		this.updateFanspeed = this.updateFanspeed.bind(this);

		this.updateFanspeed();
		this._syncInterval = setInterval(this.updateFanspeed, POLL_INTERVAL);
		
		// register a capability listener
		this.registerCapabilityListener('fan_speed', async (value) => {
			console.log('adjusting fanSpeed...');
			
			this.cm.getDevice(this.getData()['id']).then(spider => {
				this.cm.setFanSpeed(spider, value).then(device => {
					console.log('updated fanSpeed to: ', device.properties[2]);
				})
			});

		});
	}

	updateFanspeed() {
		this.cm.getDevice(this.getData()['id']).then(spider => {
			const FanSpeed = spider.properties.find(p => p.id === 'FanSpeed');

			console.log('retreived current fan_speed of '+this.getName(), FanSpeed.status);
			this.setCapabilityValue('fan_speed', FanSpeed.status);
		});
	}
	
}
module.exports = Fan;