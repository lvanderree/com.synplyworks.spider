The "Itho Daalderop gateway" is required!

How does it work?
- Install the app
- Add new devices to Homey, and select Spider
- Choose if you want to add the Spider Thermostats or the Itho Fan
- Provide your mijn.ithodaalderop.nl username + password
- Wait for the api to show your Spiders and add them
- Now control your device via Homey 

Current features that are implemented:
- login at the mijn.ithodaalderop.nl api
- get the supported devices
- find the spiders
- control the fan via Homey
- read out and control the thermostat (temperature and operation mode) via Homey
- refresh every 5 minutes
- see data at insights
- use your devices in flows (Please notes, because of the polling interval it can take up to 5 minutes before the state is updated)
- implemented the connected smartmeter

Features on the wishlist:
- improve widgets layout
- add thermostat property: "itho_override_end_time"
- reauthenticate when token is expired
- add off_peak powergrid property/prices
- add epex energy prices 
