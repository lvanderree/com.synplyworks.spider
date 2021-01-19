"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
var node_fetch_1 = __importDefault(require("node-fetch"));
var URLSearchParams = require('url').URLSearchParams;
// THANKS TO: https://github.com/peternijssen/spiderpy/
var REFRESH_RATE = 120;
var BASE_URL = 'https://mijn.ithodaalderop.nl';
var AUTHENTICATE_URL = BASE_URL + '/api/tokens';
var DEVICES_URL = BASE_URL + '/api/devices';
var ENERGY_DEVICES_URL = BASE_URL + '/api/devices/energy/energyDevices';
var POWER_PLUGS_URL = BASE_URL + '/api/devices/energy/smartPlugs';
var ENERGY_MONITORING_URL = BASE_URL + '/api/monitoring/15/devices';
var headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'X-Client-Platform': 'android-phone',
    'X-Client-Version': '1.5.3 (3561)',
    'X-Client-Library': 'SpiderJS'
};
var Client = /** @class */ (function () {
    function Client(username, password) {
        var _this = this;
        this.isAuthenticated = function () {
            return _this.auth && (Date.now() < _this.auth.expires_at);
        };
        this.getUnixTimestampSeconds = function () {
            return Math.round(new Date().getTime() / 1000);
        };
        this.username = username;
        this.password = password;
        this.auth = null;
    }
    Client.prototype.testCredentials = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.login()];
                    case 1: return [2 /*return*/, _b.sent()];
                    case 2:
                        _a = _b.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    Client.prototype.getDevices = function () {
        return __awaiter(this, void 0, void 0, function () {
            var deviceHeaders, response, _a, _b, _c, _d, _e, devices;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!!this.isAuthenticated()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.login()];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2:
                        deviceHeaders = Object.assign({
                            'authorization': 'Bearer ' + this.auth.access_token,
                        }, headers);
                        deviceHeaders["Content-Type"] = 'application/json';
                        return [4 /*yield*/, node_fetch_1.default(DEVICES_URL, {
                                method: 'GET',
                                headers: deviceHeaders,
                            })];
                    case 3:
                        response = _f.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        _b = (_a = console).log;
                        _c = ['getting devices failed: '];
                        return [4 /*yield*/, response.text()];
                    case 4:
                        _b.apply(_a, _c.concat([_f.sent()]));
                        _d = Error.bind;
                        _e = 'getting devices failed: ';
                        return [4 /*yield*/, response.text()];
                    case 5: throw new (_d.apply(Error, [void 0, _e + (_f.sent())]))();
                    case 6:
                        ;
                        return [4 /*yield*/, response.json()];
                    case 7:
                        devices = _f.sent();
                        // console.log('getting devices succeeded');
                        // console.log(JSON.stringify(devices));
                        return [2 /*return*/, devices];
                }
            });
        });
    };
    /**
     *
     * @param device the device to push the update for
     * @returns the device state after the update call
     */
    Client.prototype.updateDevice = function (device) {
        return __awaiter(this, void 0, void 0, function () {
            var deviceHeaders, url, response, _a, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        if (!!this.isAuthenticated()) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.login()];
                    case 1:
                        _f.sent();
                        _f.label = 2;
                    case 2:
                        deviceHeaders = Object.assign({
                            'authorization': 'Bearer ' + this.auth.access_token,
                        }, headers);
                        deviceHeaders["Content-Type"] = 'application/json';
                        url = DEVICES_URL + "/" + device.id;
                        return [4 /*yield*/, node_fetch_1.default(url, {
                                method: 'PUT',
                                body: JSON.stringify(device),
                                headers: deviceHeaders,
                            })];
                    case 3:
                        response = _f.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        _b = (_a = console).log;
                        _c = ['updating device failed: '];
                        return [4 /*yield*/, response.text()];
                    case 4:
                        _b.apply(_a, _c.concat([_f.sent()]));
                        _d = Error.bind;
                        _e = 'updating device failed: ';
                        return [4 /*yield*/, response.text()];
                    case 5: throw new (_d.apply(Error, [void 0, _e + (_f.sent())]))();
                    case 6:
                        ;
                        return [4 /*yield*/, response.json()];
                    case 7: return [2 /*return*/, _f.sent()];
                }
            });
        });
    };
    Client.prototype.login = function () {
        return __awaiter(this, void 0, void 0, function () {
            var form, response, _a, _b, _c, _d, _e, auth;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        form = new URLSearchParams();
                        form.append('username', this.username);
                        form.append('password', this.password);
                        form.append('grant_type', 'password');
                        return [4 /*yield*/, node_fetch_1.default(AUTHENTICATE_URL, {
                                method: 'POST',
                                body: form,
                                headers: headers,
                            })];
                    case 1:
                        response = _f.sent();
                        if (!!response.ok) return [3 /*break*/, 4];
                        _b = (_a = console).log;
                        _c = ['authentication failed: '];
                        return [4 /*yield*/, response.text()];
                    case 2:
                        _b.apply(_a, _c.concat([_f.sent()]));
                        _d = Error.bind;
                        _e = 'authentication failed: ';
                        return [4 /*yield*/, response.text()];
                    case 3: throw new (_d.apply(Error, [void 0, _e + (_f.sent())]))();
                    case 4:
                        ;
                        return [4 /*yield*/, response.json()];
                    case 5:
                        auth = _f.sent();
                        auth['expires_at'] = (auth.expires_in - 20) * 3600 + this.getUnixTimestampSeconds();
                        this.auth = auth;
                        // console.log('authentication succeeded');
                        // console.log(this.auth);
                        return [2 /*return*/, true];
                }
            });
        });
    };
    return Client;
}());
exports.Client = Client;
exports.default = Client;
