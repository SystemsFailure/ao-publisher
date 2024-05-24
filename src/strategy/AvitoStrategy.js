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
        var parser = new DOMParser();
        var doc = parser.parseFromString(htmlString, 'text/html');
        var rows = doc.querySelectorAll('table.report tbody tr');
        // Преобразуем NodeList в массив
        var rowsArray = Array.from(rows);
        for (var _i = 0, rowsArray_1 = rowsArray; _i < rowsArray_1.length; _i++) {
            var row = rowsArray_1[_i];
            var statusSpan = row.querySelector('td span.is-green');
            var itemIdElement = row.querySelector('td.item-id');
            if (!statusSpan || statusSpan.textContent !== 'Соответствует формату') {
                if (itemIdElement) {
                    var itemId = parseInt(itemIdElement.textContent || '0', 10);
                    return itemId;
                }
            }
        }
        return true;
    };
    // Валидация xml фида через авито xml валидатор
    AvitoPublisher.prototype.validXMLFile = function () {
        return __awaiter(this, arguments, void 0, function (filePath) {
            var url, headers, xmlData, response, html, result, error_1;
            if (filePath === void 0) { filePath = 'src/tmp/converted/xml/avito/output.xml'; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://autoload.avito.ru/api/v2/public/xml_checker/upload/';
                        headers = {
                            'Accept': '*/*',
                            'Accept-Encoding': 'gzip, deflate, br, zstd',
                            'Accept-Language': 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',
                            'Content-Type': 'text/xml',
                            'Dnt': '1',
                            'Origin': 'https://autoload.avito.ru',
                            'Priority': 'u=1, i',
                            'Referer': 'https://autoload.avito.ru/format/xmlcheck/',
                            'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                            'Sec-Ch-Ua-Mobile': '?0',
                            'Sec-Ch-Ua-Platform': '"Windows"',
                            'Sec-Fetch-Dest': 'empty',
                            'Sec-Fetch-Mode': 'cors',
                            'Sec-Fetch-Site': 'same-origin',
                            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
                        };
                        xmlData = fs.readFileSync(filePath, 
                        // path.resolve(__dirname, filePath), 
                        'utf-8');
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, axios_1.default.post(url, xmlData, { headers: headers })];
                    case 2:
                        response = _a.sent();
                        html = response.data;
                        result = this.parseHtmlResponse(html);
                        console.log(result);
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.error('Error uploading file:', error_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
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