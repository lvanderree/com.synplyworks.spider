"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var ClientManager = /** @class */ (function () {
    function ClientManager(client) {
        this.devices = undefined;
        this.client = client;
    }
    ClientManager.prototype.getDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!((this.devices == undefined) || ((Date.now() - this.updateAt) > 30000))) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.client.getDevices()];
                    case 1:
                        _a.devices = _b.sent();
                        this.updateAt = Date.now();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.devices];
                }
            });
        });
    };
    ClientManager.prototype.getThermostats = function () {
        return this.getDevices()
            .then(function (devices) {
            if (devices instanceof Array) {
                var thermostats = devices.filter(function (d) { return d.type = 105; });
                return thermostats;
            }
            return [];
        });
    };
    ClientManager.prototype.getSpiders = function () {
        return this.getDevices()
            .then(function (devices) {
            if (devices instanceof Array) {
                var thermostats = devices.filter(function (d) { return (d.type = 105) && (d.manufacturer == 'spider'); });
                return thermostats;
            }
            return [];
        });
    };
    ClientManager.prototype.getDevice = function (id) {
        return this.getDevices()
            .then(function (devices) {
            if (devices instanceof Array) {
                return devices.find(function (d) {
                    return (d.id == id);
                });
            }
            return null;
        });
    };
    ClientManager.prototype.getSpiderWithFan = function () {
        return this.getDevices()
            .then(function (devices) {
            if (devices instanceof Array) {
                return devices.find(function (d) {
                    return (d.type = 105) &&
                        (d.manufacturer == 'spider') &&
                        d.properties.find(function (p) { return p.id == 'FanSpeed'; });
                });
            }
            return null;
        });
    };
    /**
     *
     * @param device
     * @param speed    Set the fanspeed. Either 'Auto', 'Low', 'Medium', 'High', 'Boost 10', 'Boost 20', 'Boost 30'
     */
    ClientManager.prototype.setFanSpeed = function (device, speed) {
        return __awaiter(this, void 0, void 0, function () {
            var FanSpeed, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        FanSpeed = device.properties.find(function (p) { return p.id === 'FanSpeed'; });
                        if (!FanSpeed) {
                            throw new Error("device \"" + device.name + "\" has no FanSpeed property");
                        }
                        FanSpeed.status = speed.charAt(0).toUpperCase() + speed.slice(1).toLowerCase();
                        FanSpeed.statusModified = true;
                        return [4 /*yield*/, this.client.updateDevice(device)];
                    case 1:
                        response = _a.sent();
                        // console.log(response.properties[2]);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ClientManager.prototype.setTargetTemperature = function (device, temperature) {
        return __awaiter(this, void 0, void 0, function () {
            var SetpointTemperature, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        SetpointTemperature = device.properties.find(function (p) { return p.id === 'SetpointTemperature'; });
                        if (!SetpointTemperature) {
                            throw new Error("device \"" + device.name + "\" has no SetpointTemperature property");
                        }
                        SetpointTemperature.status = temperature;
                        SetpointTemperature.statusModified = true;
                        return [4 /*yield*/, this.client.updateDevice(device)];
                    case 1:
                        response = _a.sent();
                        // console.log(response.properties[2]);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ClientManager.prototype.setOperationMode = function (device, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var OperationMode, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        OperationMode = device.properties.find(function (p) { return p.id === 'OperationMode'; });
                        if (!OperationMode) {
                            throw new Error("device \"" + device.name + "\" has no OperationMode property");
                        }
                        OperationMode.status = mode;
                        OperationMode.statusModified = true;
                        console.log('update to send: ', JSON.stringify(device));
                        return [4 /*yield*/, this.client.updateDevice(device)];
                    case 1:
                        response = _a.sent();
                        // console.log(response.properties[2]);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    ClientManager.prototype.setOverrideMode = function (device, mode) {
        return __awaiter(this, void 0, void 0, function () {
            var OverrideMode, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        OverrideMode = device.properties.find(function (p) { return p.id === 'OverrideMode'; });
                        if (!OverrideMode) {
                            throw new Error("device \"" + device.name + "\" has no OverrideMode property");
                        }
                        OverrideMode.status = mode;
                        OverrideMode.statusModified = true;
                        console.log('update to send: ', JSON.stringify(device));
                        return [4 /*yield*/, this.client.updateDevice(device)];
                    case 1:
                        response = _a.sent();
                        // console.log(response.properties[2]);
                        return [2 /*return*/, response];
                }
            });
        });
    };
    return ClientManager;
}());
exports.ClientManager = ClientManager;
exports.default = ClientManager;
