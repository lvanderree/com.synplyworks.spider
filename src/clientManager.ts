import { Device, EnergyDevice, Client, ENERGY_DEVICES_URL } from "./client";

export class ClientManager {
  protected client: Client;

  protected devices: Device[] | EnergyDevice[] = undefined; 
  updateAt: number;

  constructor(client: Client) {
    this.client = client;
  }

  async getDevices(url?: string) : Promise<Device[] | EnergyDevice[]> {
    // the manager caches devices for 30s, to avoid flooding Itho
    if ((this.devices == undefined) || ((Date.now() - this.updateAt) > 30000))
    {
      this.devices = await this.client.getDevices(url);
      this.updateAt = Date.now();
      // todo loop through devices and create object with key=device.id 
    }
    
    return this.devices;
  }

  getDevice(id: string) : Promise<Device> {
    return this.getDevices()
      .then(devices => {
        if (devices instanceof Array) {
          return devices.find(d => {
            return (d.id == id)
          });
        }
    
        return null;
      });
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
          const thermostats = devices.filter((d) => {
            return (d.type = 105) 
                   && (d.manufacturer == 'spider') 
                   && d.properties.find(p => {return p.id == 'SetpointTemperature'})
          });
    
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
            return (d.type = 105) 
                   && (d.manufacturer == 'spider')
                   && d.properties.find(p => {return p.id == 'SetpointTemperature'}) 
                   && d.properties.find(p => {return p.id == 'FanSpeed'})
          });
        }
    
        return null;
      });
  }

  getEnergyDevices() : Promise<EnergyDevice[]> {
    return this.getDevices(ENERGY_DEVICES_URL)
      .then(energyDevices => {
        if (energyDevices instanceof Array) {
          const devices = energyDevices.filter((d) => {
            const e = d as EnergyDevice;
            return (e.isSwitchedOn = true) 
                   && (e.isOnline == true);
          });
          
          return devices as EnergyDevice[];
        }
    
        return [];
      });
  }

  getCentralMeters() : Promise<EnergyDevice[]> {
    return this.getEnergyDevices()
      .then(energyDevices => {
        if (energyDevices instanceof Array) {
          const devices = energyDevices.filter((d) => {
            return (d.isCentralMeter = true)
          });
    
          return devices;
        }
    
        return [];
      });
  }

  /**
   * 
   * @param device 
   * @param speed    Set the fanspeed. Either 'Away', 'Auto', 'Low', 'Medium', 'High', 'Boost 10', 'Boost 20', 'Boost 30'
   */
  async setFanSpeed(device: Device, speed: string) : Promise<Device> {
    const FanSpeed = device.properties.find(p => p.id === 'FanSpeed');

    if (!FanSpeed) {
      throw new Error(`device "${device.name}" has no FanSpeed property`);
    }

    FanSpeed.status = speed.charAt(0).toUpperCase() + speed.slice(1).toLowerCase();
    FanSpeed.statusModified = true;

    // console.log('update to send: ', JSON.stringify(device));

    const response = await this.client.updateDevice(device);
    // console.log(response.properties[2]);
    return response;
  }

  async setTargetTemperature(device: Device, temperature: number) : Promise<Device> {
    const SetpointTemperature = device.properties.find(p => p.id === 'SetpointTemperature');

    if (!SetpointTemperature) {
      throw new Error(`device "${device.name}" has no SetpointTemperature property`);
    }

    SetpointTemperature.status = temperature;
    SetpointTemperature.statusModified = true;

    // console.log('update to send: ', JSON.stringify(device));

    const response = await this.client.updateDevice(device);
    // console.log(response.properties[2]);
    return response;
  }

  async setOperationMode(device: Device, mode: string) : Promise<Device> {
    const OperationMode = device.properties.find(p => p.id === 'OperationMode');
    
    if (!OperationMode) {
      throw new Error(`device "${device.name}" has no OperationMode property`);
    }
    
    OperationMode.status = mode.charAt(0).toUpperCase() + mode.slice(1).toLowerCase() ;;
    OperationMode.statusModified = true;

    console.log('update to send: ', JSON.stringify(device));

    const response = await this.client.updateDevice(device);
    // console.log(response.properties[2]);
    return response;
  }

  async setOverrideMode(device: Device, mode: string) : Promise<Device> {
    const OverrideMode = device.properties.find(p => p.id === 'OverrideMode');
    
    if (!OverrideMode) {
      throw new Error(`device "${device.name}" has no OverrideMode property`);
    }
    
    OverrideMode.status = mode;
    OverrideMode.statusModified = true;

    console.log('update to send: ', JSON.stringify(device));

    const response = await this.client.updateDevice(device);
    // console.log(response.properties[2]);
    return response;
  }

}

export default ClientManager;