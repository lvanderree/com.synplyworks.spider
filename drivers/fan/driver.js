'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
const ClientManager = require('../../lib/clientManager');

class FanDriver extends Homey.Driver {

  onInit() {
    this.log('FanDriver has been inited');

    this.flowTriggerFanSpeedChanged = new Homey.FlowCardTriggerDevice('fan_speed_changed').register();

    new Homey.FlowCardCondition('fan_speed_is').register().registerRunListener(async (args, state) => {
      return (args.device.getCapabilityValue('fan_speed') == args.fan_speed);
    });

    new Homey.FlowCardAction('set_fan_speed').register().registerRunListener(async (args, state) => {
      console.log('setCapabilityValue(', 'fan_speed', args.speed);
      args.device.setCapabilityValue('fan_speed', args.speed);
      return args.device.setFanSpeed(args.speed);
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

      cm.getSpiderWithFan()
        .then(spider => {
          const devices = [{
            name: `fan_${spider.name}`,
            data: {
              type: 'spider_fan',
              id: spider.id,
            },
            settings: {
              // Store username & password in settings
              // so the user can change them later
              username,
              password,
            },
          }];

          callback(null, devices);
        });

      // or fire a callback with Error to show that instead
      // callback( new Error('Something bad has occured!') );
    });
  }

  onPairListDevices(data, callback) {
    const devices = [
      {
        // Required properties:
        data: { id: 'fan' },

        // Optional properties, these overwrite those specified in app.json:
        // "capabilities": [ "onoff", "dim" ],
        // "capabilitiesOptions: { "onoff": {} },

        // Optional properties, device-specific:
        // "store": { "foo": "bar" },
        settings: { username: '', password: 'password' },

      },
    ];

    callback(null, devices);
  }

}

module.exports = FanDriver;
