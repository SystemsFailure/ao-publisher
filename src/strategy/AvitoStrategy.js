"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var axios_1 = __importDefault(require("axios"));
var xmljs = __importStar(require("xml-js"));
var fs = __importStar(require("fs"));
var cheerio_1 = __importDefault(require("cheerio"));
var avito_headers_1 = require("../helpers/avito.headers");
var AvitoPublisher = /** @class */ (function () {
    function AvitoPublisher() {
        this.accessToken = '';
        this.authService = new AuthService();
    }
    AvitoPublisher.prototype.convert = function (adsData) { return this.convertedInXML(adsData); };
    AvitoPublisher.prototype.publish = function (data) { return this.public(data); };
    AvitoPublisher.prototype.valid = function (filePath) { return this.validXMLFile(); };
    // Реализация
    AvitoPublisher.prototype.checkExcelFile = function () { };
    AvitoPublisher.prototype.convertedInXML = function (objects) {
        var json = this.convertKeysJson(objects);
        var xml = xmljs.js2xml(json, { compact: true, spaces: 4 });
        fs.writeFileSync('src/tmp/converted/xml/avito/output.xml', xml);
        console.log('successfuly formated in xml avito');
    };
    AvitoPublisher.prototype.public = function (data) {
        // Реализация публикации
    };
    // Парсим html результат валидации
    AvitoPublisher.prototype.parseHtmlResponse = function (htmlString) {
        var $ = cheerio_1.default.load(htmlString);
        var rows = $('table.report tbody tr').toArray();
        if (!rows) {
            throw new Error('rows is empty or undefined or not valid');
        }
        for (var _i = 0, rows_1 = rows; _i < rows_1.length; _i++) {
            var row = rows_1[_i];
            var statusSpan = $(row).find('td span.is-green');
            var itemIdElement = $(row).find('td.item-id');
            console.log("\u041E\u0431\u044A\u0435\u043A\u0442 \u0441 ID: ".concat(itemIdElement.text(), " - ").concat(statusSpan.text()));
            if (!statusSpan.length || statusSpan.text() !== 'Соответствует формату') {
                if (itemIdElement.length) {
                    var itemId = parseInt(itemIdElement.text() || '0', 10);
                    return itemId;
                }
            }
        }
        return true;
    };
    // Валидация xml фида через авито xml валидатор
    AvitoPublisher.prototype.validXMLFile = function () {
        return __awaiter(this, arguments, void 0, function (filePath) {
            var url, xmlData, response, subResponse, html, result, error_1;
            if (filePath === void 0) { filePath = 'src/tmp/converted/xml/avito/output.xml'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://autoload.avito.ru/api/v2/public/xml_checker/upload/';
                        xmlData = fs.readFileSync(filePath, 'utf-8');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.post(url, xmlData, { headers: avito_headers_1.headers })];
                    case 2:
                        response = _a.sent();
                        if (!response.data['data'] || !response.data['data']['id']) {
                            throw new Error('Данные для дальнейшей валидации не получены');
                        }
                        return [4 /*yield*/, axios_1.default.get("https://autoload.avito.ru/api/v2/public/xml_checker/result/".concat(response.data['data']['id'], "/"))];
                    case 3:
                        subResponse = _a.sent();
                        html = subResponse.data;
                        result = this.parseHtmlResponse(html);
                        if (!result) {
                            console.debug('result is not valid, maybe, NaN');
                            return [2 /*return*/];
                        }
                        console.log('Результат провекри xml фида для avito: ', result);
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error('Error uploading file:', error_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // access_token для авито
    AvitoPublisher.prototype.authorization = function (creditionals_1) {
        return __awaiter(this, arguments, void 0, function (creditionals, grant_type) {
            var data;
            if (grant_type === void 0) { grant_type = "client_credentials"; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, axios_1.default.post('https://api.avito.ru/token', __assign(__assign({}, creditionals), { grant_type: grant_type }))];
                    case 1:
                        data = (_a.sent()).data;
                        if (!data.access_token)
                            return [2 /*return*/];
                        this.accessToken = data.access_token;
                        return [2 /*return*/, this.accessToken];
                }
            });
        });
    };
    // Работает по обратной схеме в отличие от CianStrategy
    AvitoPublisher.prototype.convertKeysJson = function (objects) {
        return {
            Ads: {
                _attributes: {
                    formatVersion: "3",
                    target: "Avito.ru"
                },
                Ad: objects.map(function (obj) {
                    var result = {};
                    var splitedContactPhone = String(obj['ContactPhone']).split('|');
                    // Список ключей, которые мы хотим исключить
                    var excludedKeys = ['Площадка', 'RoomArea'];
                    for (var key in obj) {
                        if (obj.hasOwnProperty(key) && !excludedKeys.includes(key)) {
                            if (key === 'ContactPhone') {
                                result['ContactPhone'] = {
                                    _text: "\n                    +".concat(splitedContactPhone[0].toString().trim(), " ").concat(splitedContactPhone[1].toString().trim(), "\n                  ")
                                };
                            }
                            else {
                                result[key] = {
                                    _text: obj[key].toString().trim()
                                };
                            }
                        }
                    }
                    return result;
                })
            }
        };
    };
    return AvitoPublisher;
}());
exports.default = AvitoPublisher;
var AuthService = /** @class */ (function () {
    function AuthService() {
        this.accessToken = null;
    }
    AuthService.prototype.authorization = function (credentials_1) {
        return __awaiter(this, arguments, void 0, function (credentials, grant_type) {
            var data, error_2, axiosError;
            if (grant_type === void 0) { grant_type = AuthService.GRANT_TYPE; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!credentials.client_id || !credentials.client_secret) {
                            throw new Error('Missing client_id or client_secret in credentials');
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post(AuthService.API_URL, __assign(__assign({}, credentials), { grant_type: grant_type }))];
                    case 2:
                        data = (_a.sent()).data;
                        if (!data.access_token) {
                            console.error('No access_token received');
                            return [2 /*return*/];
                        }
                        this.accessToken = data.access_token;
                        return [2 /*return*/, this.accessToken];
                    case 3:
                        error_2 = _a.sent();
                        axiosError = error_2;
                        if (axiosError.response) {
                            // Сервер вернул ответ с кодом, отличным от 2xx
                            console.error('Error response from server:', axiosError.response.data);
                        }
                        else if (axiosError.request) {
                            // Запрос был сделан, но ответа не получено
                            console.error('No response received:', axiosError.request);
                        }
                        else {
                            // Произошла ошибка при настройке запроса
                            console.error('Error setting up request:', axiosError.message);
                        }
                        console.error('Error details:', axiosError.config);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    AuthService.API_URL = 'https://api.avito.ru/token';
    AuthService.GRANT_TYPE = 'client_credentials';
    return AuthService;
}());
