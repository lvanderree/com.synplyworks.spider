import fetch from "node-fetch";
// import stubbedDevices from "./stubbedDevices";

declare var require: any
const URLSearchParams = require('url').URLSearchParams;


// THANKS TO: https://github.com/peternijssen/spiderpy/
const REFRESH_RATE = 120;
const BASE_URL = 'https://mijn.ithodaalderop.nl';
  
const AUTHENTICATE_URL = BASE_URL + '/api/tokens';
const DEVICES_URL = BASE_URL + '/api/devices';
const ENERGY_DEVICES_URL = BASE_URL + '/api/devices/energy/energyDevices';
const POWER_PLUGS_URL = BASE_URL + '/api/devices/energy/smartPlugs';
const ENERGY_MONITORING_URL = BASE_URL + '/api/monitoring/15/devices';

const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'X-Client-Platform': 'android-phone',
  'X-Client-Version': '1.5.3 (3561)',
  'X-Client-Library': 'SpiderJS'
};

interface Auth {
  token_type: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at: number;
}

export interface Device {
  type: number;
  scheduleId: string;
  id: string;
  name: string;
  isOnline: boolean;
  model: string;
  manufacturer: string;
  properties: Array<any>;
  // parameters: Object
  _etag: string;
  bdrSetting: number;
}

export class Client {
  protected username : string;
  protected password : string;

  protected auth: Auth;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;

    this.auth = null;
  }

  async testCredentials() : Promise<boolean> {
    try {
      return await this.login();
    } catch {
      return false;
    }
  }

  async getDevices() : Promise<Device[]> {

    // return stubbedDevices;

    if (!this.isAuthenticated()) {
      await this.login();
    }

    const deviceHeaders = Object.assign({
      'authorization': 'Bearer ' + this.auth.access_token,
    }, headers);
    deviceHeaders["Content-Type"] = 'application/json';

    // console.log('getting devices from: ', DEVICES_URL);

    const response = await fetch(DEVICES_URL, {
      method: 'GET',
      headers: deviceHeaders,
    });

    if (!response.ok) {
      console.log('getting devices failed: ', await response.text());
      throw new Error('getting devices failed: ' + await response.text());
    };

    const devices = await response.json();

    // console.log('getting devices succeeded');
    // console.log(JSON.stringify(devices));

    return devices;
  }

  /**
   * 
   * @param device the device to push the update for
   * @returns the device state after the update call
   */
  async updateDevice(device : Device) : Promise<Device> {
    if (!this.isAuthenticated()) {
      await this.login();
    }

    const deviceHeaders = Object.assign({
      'authorization': 'Bearer ' + this.auth.access_token,
    }, headers);
    deviceHeaders["Content-Type"] = 'application/json';

    const url = `${DEVICES_URL}/${device.id}`;
    // console.log('updateing devices via: ', url);

    const response = await fetch(url, {
      method: 'PUT',
      body: JSON.stringify(device),
      headers: deviceHeaders,
    });

    if (!response.ok) {
      console.log('updating device failed: ', await response.text());
      throw new Error('updating device failed: ' + await response.text());
    };

    return await response.json();
  }

  protected isAuthenticated = () : boolean => {
    return this.auth && (Date.now() < this.auth.expires_at)
  }

  protected getUnixTimestampSeconds = () : number => {
    return Math.round(new Date().getTime() / 1000);
  };
  
  protected async login() : Promise<boolean> {    
    const form = new URLSearchParams();
    form.append('username', this.username);
    form.append('password', this.password);
    form.append('grant_type', 'password');

    // console.log('authenticating at: ', AUTHENTICATE_URL, form);

    const response = await fetch(AUTHENTICATE_URL, {
      method: 'POST',
      body: form, 
      headers: headers,
    });

    if (!response.ok) {
      console.log('authentication failed: ', await response.text());
      throw new Error('authentication failed: ' + await response.text());
    };

    const auth = await response.json();

    auth['expires_at'] = (auth.expires_in - 20) * 3600 + this.getUnixTimestampSeconds();

    this.auth = auth as Auth;

    // console.log('authentication succeeded');
    // console.log(this.auth);
    return true;
  }

}
export default Client;
