'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
const ClientManager = require('../../lib/clientManager');

const POLL_INTERVAL = 1000 * 60 * 5; // 5 min
class Fan extends Homey.Device {

  onInit() {
    this.log('Initializing Itho Fan');
    this.log('Name:', this.getName());
    this.log('Class:', this.getClass());
    this.log('Data:', this.getData());

    const settings = this.getSettings();

    const client = new Client['default'](settings.username, settings.password);
    this.cm = new ClientManager['default'](client);

    this.driver = this.getDriver();

    // init fan_speed to current speed
    this.updateFanspeed = this.updateFanspeed.bind(this);

    this.updateFanspeed();
    this._syncInterval = setInterval(this.updateFanspeed, POLL_INTERVAL);

    // register a capability listener
    this.registerCapabilityListener('fan_speed', async value => {
      this.setFanSpeed(value);
    });
  }

  getDevice() {
    return this.cm.getDevice(this.getData()['id']);
  }

  setFanSpeed(speed) {
    console.log('adjusting fanSpeed...');
    return this.getDevice().then(spider => {
      this.cm.setFanSpeed(spider, speed).then(device => {
        console.log('updated fanSpeed to: ', device.properties[2]);
      });
    });
  }

  updateFanspeed() {
    this.getDevice().then(spider => {
      const FanSpeed = spider.properties.find(p => p.id === 'FanSpeed');
      const newSpeed = FanSpeed.status;
      const oldSpeed = this.getCapabilityValue('fan_speed');
      console.log(`retreived current fan_speed of ${this.getName()}`, oldSpeed, newSpeed);
      if (oldSpeed != newSpeed) {
        this.setCapabilityValue('fan_speed', newSpeed);
        this.driver.flowTriggerFanSpeedChanged.trigger(this, { oldSpeed, newSpeed });
      }

      this.setCapabilityValue('fan_speed', FanSpeed.status);
    });
  }

}
module.exports = Fan;
