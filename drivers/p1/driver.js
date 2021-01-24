'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
const ClientManager = require('../../lib/clientManager');

class P1Driver extends Homey.Driver {

  onInit() {
    this.log('P1 SmartMeter has been inited');

    // this.flowTriggerThermostatDemandChanged = new Homey.FlowCardTriggerDevice('itho_zone_demand_changed').register();

    // new Homey.FlowCardCondition('thermostat_zone_demand_is').register().registerRunListener(async (args, state) => {
    //   return (args.device.getCapabilityValue('itho_zone_demand') == args.itho_zone_demand);
    // });
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

      cm.getCentralMeters()
        .then(meters => {
          if (meters instanceof Array) {
            meters = [{ 
              name: 'P1 Smart Meter',
              data: {
                type: 'smart_meter',
                id: 'spider.smart_meter',
              },
              settings: {
                // Store username & password in settings
                // so the user can change them later
                username,
                password,
              },
            }];
            
            callback(null, meters);
          }

          // or fire a callback with Error to show that instead
          callback( new Error('Smart Meter not found') );
        });
    });
  }

}
module.exports = P1Driver;
