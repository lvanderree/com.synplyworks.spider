'use strict';

const Homey = require('homey');
const Client = require('../../lib/client');
var ClientManager = require("../../lib/clientManager");

class MyDriver extends Homey.Driver {
	
	onInit() {
		this.log('MyDriver has been inited');
	}

	onPair( socket ) {
		let username = '';
		let password = '';

    const devices = [
      {
        'name': 'fan',
        'data': {
          'id': 'fan',
        }
      }
		];
		
		socket.on('login', ( data, callback ) => {
			username = data.username;
			password = data.password;
			
			const client = new Client["default"](username, password);
			client.testCredentials()
				.then(credentialsAreValid => {
					if( credentialsAreValid === true ) {
						callback( null, true );
					} else if( credentialsAreValid === false ) {
						callback( null, false );
					} else {
						throw new Error('Invalid Response');
					}
				})
				.catch(err => {
					callback(err);
				});
		});

    socket.on('list_devices', function( data, callback ) {
			const client = new Client["default"](username, password);
			const cm = new ClientManager["default"](client);

			cm.getSpiderWithFan()
			.then(spider => {
				const devices = [{
					name: spider.name,
					data: {
						id: spider.id,
					},
					settings: {
						// Store username & password in settings
						// so the user can change them later
						username,
						password
					}
				}];
				callback( null, devices );
			});


      // when no devices are found, return an empty array
      // callback( null, [] );

      // or fire a callback with Error to show that instead
      // callback( new Error('Something bad has occured!') );
    });
  }

	onPairListDevices( data, callback ) {

    const devices = [
      {
        // Required properties:
        "data": { "id": "fan" },

        // Optional properties, these overwrite those specified in app.json:
        // "name": "My Device",
        // "icon": "/my_icon.svg", // relative to: /drivers/<driver_id>/assets/
        // "capabilities": [ "onoff", "dim" ],
        // "capabilitiesOptions: { "onoff": {} },

        // Optional properties, device-specific:
        // "store": { "foo": "bar" },
        "settings": { "username": "", "password": "password" },

      }
    ];

    callback( null, devices );

  }
	
}

module.exports = MyDriver;