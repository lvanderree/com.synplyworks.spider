'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
const ClientManager = require('../../lib/clientManager');

const POLL_INTERVAL = 1000 * 60 * 5; // 5 min
class P1 extends Homey.Device {

  onInit() {
    this.log('Initializing P1 SmartMeter');
    this.log('Name:', this.getName());
    this.log('Class:', this.getClass());
    this.log('Data:', this.getData());

    const settings = this.getSettings();
    this.gasUsage = {};
    this.powerUsage = {};

    const client = new Client['default'](settings.username, settings.password);
    this.cm = new ClientManager['default'](client);

    this.driver = this.getDriver();

    // init usages
    this.updateUsages = this.updateUsages.bind(this);

    this.updateUsages();
    this._syncInterval = setInterval(this.updateUsages, POLL_INTERVAL);
  }

  getCentralMeters() {
    return this.cm.getCentralMeters();
  }

  updateUsages() {
    this.getCentralMeters().then(meters => {
      meters
        .filter(meter => meter.energyType==20) // gas
        .forEach(gas => { // should be only one meter
          this.setCapabilityValue('meter_gas', gas.meterIndexCurrentValue);
        });

    const power_usage = meters
        .filter(meter => meter.energyType==10 & meter.isProducer == false) // elek consume
        .reduce(
          (mp1, mp2) => { return { // should be two meters (low and normal consume)
            meterIndexCurrentValue: mp1.meterIndexCurrentValue + mp2.meterIndexCurrentValue,
            currentUsage: mp1.currentUsage + mp2.currentUsage
          }},
          { meterIndexCurrentValue: 0, currentUsage: 0 }
        );
    console.log(`power_usage: `, power_usage);

    const power_production = meters
    .filter(meter => meter.energyType==10 & meter.isProducer == true) // elek production
    .reduce(
      (mp1, mp2) => { return { // should be two meters (low and normal consume)
        meterIndexCurrentValue: mp1.meterIndexCurrentValue + mp2.meterIndexCurrentValue,
        currentUsage: mp1.currentUsage + mp2.currentUsage
      }},
      { meterIndexCurrentValue: 0, currentUsage: 0 }
    );
    console.log(`power_production: `, power_production);

    
    this.setCapabilityValue('meter_power', power_usage.meterIndexCurrentValue / 1000);
    this.setCapabilityValue('measure_power', power_usage.currentUsage / 1000);
    this.setCapabilityValue('meter_power.produced', -1 * power_production.meterIndexCurrentValue / 1000);
    this.setCapabilityValue('measure_power.produced', -1 * power_production.currentProduction / 1000);
        
      
    });
  }

}
module.exports = P1;
