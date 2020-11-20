'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
const ClientManager = require('../../lib/clientManager');

class ThermostatDriver extends Homey.Driver {

  onInit() {
    this.log('ThermostatDriver has been inited');

    this.flowTriggerThermostatModeChanged = new Homey.FlowCardTriggerDevice('thermostat_mode_changed').register();

    new Homey.FlowCardCondition('thermostat_mode_is').register().registerRunListener(async (args, state) => {
      return (args.device.getCapabilityValue('thermostat_mode') == args.thermostat_mode);
    });

    new Homey.FlowCardAction('set_thermostat_mode').register().registerRunListener(async (args, state) => {
      console.log('setCapabilityValue(', 'thermostat_mode', args.thermostat_mode);
      args.device.setCapabilityValue('thermostat_mode', args.thermostat_mode);
      return args.device.setThermostatMode(args.thermostat_mode);
    });
  }

  onPair(socket) {
    let username = '';
    let password = '';

    // TODO: DRY
    socket.on('login', (data, callback) => {
      username = data.username;
      password = data.password;

      const client = new Client['default'](username, password);
      client.testCredentials()
        .then(credentialsAreValid => {
          if (credentialsAreValid === true) {
            callback(null, true);
          } else if (credentialsAreValid === false) {
            callback(null, false);
          } else {
            throw new Error('Invalid Response');
          }
        })
        .catch(err => {
          callback(err);
        });
    });

    socket.on('list_devices', (data, callback) => {
      const client = new Client['default'](username, password);
      const cm = new ClientManager['default'](client);

      cm.getSpiders()
        .then(spiders => {
          const devices = spiders.map(spider => {
            const setpointTemperature = spider.properties.find(property => {
              return property.id === 'SetpointTemperature';
            });

            return {
              name: spider.name,
              data: {
                type: 'spider_thermostat',
                id: spider.id,
              },
              settings: {
                // Store username & password in settings
                // so the user can change them later
                username,
                password,
              },
              capabilitiesOptions: {
                target_temperature: {
                  min: setpointTemperature.min,
                  max: setpointTemperature.max,
                  step: setpointTemperature.step,
                },
              },
            };
          });

          callback(null, devices);
        });

      // or fire a callback with Error to show that instead
      // callback( new Error('Something bad has occured!') );
    });
  }

}
module.exports = ThermostatDriver;
