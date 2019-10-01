'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
var ClientManager = require("../../lib/clientManager");

const POLL_INTERVAL = 1000 * 60 * 5; // 5 min
class Thermostat extends Homey.Device {
	
	onInit() {
		this.log('Initializing Spider Thermostat');
		this.log('Name:', this.getName());
		this.log('Class:', this.getClass());
		this.log('Data:', this.getData());

		const settings = this.getSettings();

		const client = new Client["default"](settings.username, settings.password);
		this.cm = new ClientManager["default"](client);

		this.driver = this.getDriver();

		// init target_temperature to current temperature
		this.updateThermostatValues = this.updateThermostatValues.bind(this);

		this.updateThermostatValues();
		this._syncInterval = setInterval(this.updateThermostatValues, POLL_INTERVAL);


		// register capability listeners
		this.registerCapabilityListener('target_temperature', async (value) => {
			console.log('adjusting target_temperature at ' + this.getName(), value);
			this.cm.getDevice(this.getData()['id']).then(spider => {
				this.cm.setTargetTemperature(spider, value).then(device => {
					console.log('updated temperature at ' + this.getName() + ' to: ', device);
				});
			});
		});

		this.registerCapabilityListener('thermostat_mode', async (value) => {
			console.log('adjusting thermostat_mode at ' + this.getName(), value);
			this.cm.getDevice(this.getData()['id']).then(spider => {
				this.cm.setOperationMode(spider, value).then(device => {
					console.log('updated operation mode at ' + this.getName() + ' to: ', device);
				});
			});
		});

		this.registerCapabilityListener('itho_override_mode', async (value) => {
			console.log('adjusting override_mode at ' + this.getName(), value);
			this.cm.getDevice(this.getData()['id']).then(spider => {
				this.cm.setOverrideMode(spider, value).then(device => {
					console.log('updated override mode at ' + this.getName() + ' to: ', device);
				});
			});
		});

	}

	updateThermostatValues() {
		this.cm.getDevice(this.getData()['id']).then(spider => {
			const SetpointTemperature = spider.properties.find(p => p.id === 'SetpointTemperature');
			console.log('retreived current target_temperature of '+this.getName(), SetpointTemperature.status);
			this.setCapabilityValue('target_temperature', Number(SetpointTemperature.status));
	
			const AmbientTemperature = spider.properties.find(p => p.id === 'AmbientTemperature');
			console.log('retreived current temperature at '+this.getName(), AmbientTemperature.status);
			this.setCapabilityValue('measure_temperature', Number(AmbientTemperature.status));
	
			const OperationMode = spider.properties.find(p => p.id === 'OperationMode' );
			const newMode = OperationMode.status.toLowerCase();
			console.log('retreived current operation mode at '+this.getName(), newMode);
			const oldMode = this.getCapabilityValue('thermostat_mode');
			if (oldMode != newMode) {
				this.setCapabilityValue('thermostat_mode', newMode);
				this.driver.flowTriggerThermostatModeChanged.trigger(this, {oldMode, newMode});
			}

			const OverrideMode = spider.properties.find(p => p.id === 'OverrideMode' );
			console.log('retreived current zone demand at '+this.getName(), OverrideMode.status);
			this.setCapabilityValue('itho_override_mode', OverrideMode.status);

			const ZoneDemand = spider.properties.find(p => p.id === 'ZoneDemand' );
			console.log('retreived current zone demand at '+this.getName(), ZoneDemand.status);
			this.setCapabilityValue('itho_zone_demand', Number(ZoneDemand.status));
		});
	}

}
module.exports = Thermostat;