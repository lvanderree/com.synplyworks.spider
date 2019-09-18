'use strict';

const Homey = require('homey');

class Spider extends Homey.App {
	
	onInit() {
		this.log('Spider is running...');
	}
	
}

module.exports = Spider;