import { Device, Client } from "./client";

export class ClientManager {
  protected client: Client;

  protected devices: Device[] = undefined; 

  constructor(client: Client) {
    this.client = client;
  }

  async getDevices() : Promise<Device[]> {
    // the manager caches devices
    if (this.devices == undefined)
    {
      this.devices = await this.client.getDevices();
    }
    
    return this.devices; 
  }

  getThermostats() : Promise<Device[]> {
    return this.getDevices()
      .then(devices => {
        if (devices instanceof Array) {
          const thermostats = devices.filter((d) => {return d.type = 105});
    
          return thermostats;
        }
    
        return [];
      });
  }

  getSpiders() : Promise<Device[]> {
    return this.getDevices()
      .then(devices => {
        if (devices instanceof Array) {
          const thermostats = devices.filter((d) => {return (d.type = 105) && (d.manufacturer == 'spider') });
    
          return thermostats;
        }
    
        return [];
      });
  }

  getSpiderWithFan() : Promise<Device> {
    return this.getDevices()
      .then(devices => {
        if (devices instanceof Array) {
          return devices.find(d => {
            return (d.type = 105) && 
                   (d.manufacturer == 'spider') && 
                    d.properties.find(p => {return p.id == 'FanSpeed'})
          });
        }
    
        return null;
      });
  }

  /**
   * 
   * @param device 
   * @param speed    Set the fanspeed. Either 'Auto', 'Low', 'Medium', 'High', 'Boost 10', 'Boost 20', 'Boost 30'
   */
  async setFanSpeed(device: Device, speed: string) : Promise<Device> {
    // console.log(' trying to set fan speed');

    var found = false;
    device.properties.forEach(property => {
      if (property['id'] == 'FanSpeed') {
        found = true;

        property.status = speed.charAt(0).toUpperCase() + speed.slice(1).toLowerCase() ;
        property.statusModified = true;
      }
    });

    if (!found) {
      throw new Error(`device "${device.name}" has no FanSpeed property`);
    }

    // console.log('update to send: ', JSON.stringify(device));

    const response = await this.client.updateDevice(device);
    // console.log(response.properties[2]);
    return response;
  }

}

export default ClientManager;