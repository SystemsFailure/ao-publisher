"use strict";
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
var xmljs = __importStar(require("xml-js"));
var fs = __importStar(require("fs"));
var axios_1 = __importDefault(require("axios"));
var cheerio_1 = __importDefault(require("cheerio"));
;
;
var headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip, deflate, br, zstd',
    'Accept-Language': 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',
    'Content-Type': 'application/json; charset=utf-8',
    'Dnt': '1',
    'Origin': 'https://www.cian.ru',
    'Priority': 'u=1, i',
    'Referer': 'https://www.cian.ru/api/validator/validate/',
    'Sec-Ch-Ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
};
var CianPublisher = /** @class */ (function () {
    function CianPublisher() {
    }
    CianPublisher.prototype.convert = function (adsData) { return this.convertedInXML(adsData); };
    CianPublisher.prototype.publish = function (data) { return this.public(data); };
    CianPublisher.prototype.valid = function () { };
    // Реализация
    CianPublisher.prototype.public = function (data) {
        // реализация публикации
    };
    CianPublisher.prototype.convertedInXML = function (objects) {
        // adsData - это объект, который получается из основного excel файла
        // в adsData попадают только те объекты, у которых platform = 'Циан'
        // далее он сопостовляется с необходимой структурой фида Циана
        // потом конвертируется в XML файл, который отправляется на почту циана, позже, если все
        // отлично - начинается выгрузка всех обектов, из ранее сформированного фида
        var json = this.transformJson(objects);
        var xml = xmljs.js2xml(json, { compact: true, spaces: 4 });
        fs.writeFileSync('src/tmp/converted/xml/cian/output.xml', xml);
        console.log('successfuly formated in xml cian');
    };
    CianPublisher.prototype.transformJson = function (objects) {
        var _this = this;
        return {
            feed: {
                feed_version: 2,
                object: objects.map(function (obj) {
                    var result = {};
                    // Прямое сопоставление
                    result['ExternalId'] = { _text: String(obj['Id']).toString().trim() };
                    var transformResult = _this.transformCategory(obj, result);
                    if (!transformResult) {
                        return;
                    }
                    result['Category'] = transformResult['Category'];
                    result['Description'] = { _text: obj['Description'].toString().trim() };
                    result['Address'] = { _text: obj['Address'].toString().trim() };
                    // Преобразование значений для BargainTerms.Price
                    // Преобразование значений для RoomType
                    transformResult = _this.transformRoomType(obj, result);
                    if (!transformResult) {
                        return;
                    }
                    result['RoomType'] = transformResult['RoomType'];
                    // result['RoomType'] = { _text: obj['RoomType'].toString().trim() };
                    transformResult = _this.transformRepairType(obj, result);
                    if (!transformResult) {
                        return;
                    }
                    result['RepairType'] = transformResult['RepairType'];
                    // result['RepairType'] = { _text: obj['Renovation'].toString().trim() };
                    // PropertyRights пропускаем
                    result['BargainTerms'] = {
                        LeaseTermType: { _text: _this.convertLeaseType(obj['LeaseType']) },
                        Price: { _text: parseFloat(obj['Price']) },
                        Deposit: { _text: _this.convertLeaseDeposit(obj['LeaseDeposit'], obj['Price']) },
                        UtilitiesTerms: {
                            IncludedInPrice: { _text: _this.convertIncludedInPrice(obj['UtilityMeters']) },
                            Price: { _text: parseInt(obj['OtherUtilitiesPayment'], 10) }
                        },
                        ClientFee: { _text: obj['LeaseCommissionSize'] }
                    };
                    result['Building'] = {
                        MaterialType: { _text: _this.convertMaterialType(obj['HouseType']) },
                        FloorsCount: { _text: obj['Floors'] }
                    };
                    result['FloorNumber'] = { _text: obj['Floor'] };
                    result['FlatRoomsCount'] = { _text: _this.convertFlatRooms(obj['Rooms']) };
                    result['TotalArea'] = { _text: obj['Square'] };
                    result['KitchenArea'] = { _text: obj['KitchenSpace'] };
                    result['ChildrenAllowed'] = { _text: _this.convertChildrenAllowed(obj['ChildrenAllowed']) };
                    result['PetsAllowed'] = { _text: _this.convertPetsAllowed(obj['PetsAllowed']) };
                    result['Phones'] = {
                        PhoneSchema: {
                            CountryCode: { _text: "+".concat(obj['ContactPhone'].split('|')[0]).toString().trim() },
                            Number: { _text: obj['ContactPhone'].split('|')[1].toString().trim() },
                        }
                    };
                    result['RoomArea'] = { _text: obj['RoomArea'] };
                    return result;
                })
            }
        };
    };
    CianPublisher.prototype.convertChildrenAllowed = function (obj) {
        switch (obj) {
            case "Да": return "True";
            case "Нет": return "False";
            default:
                throw new Error("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 childredAllowed: ".concat(obj));
        }
    };
    CianPublisher.prototype.convertPetsAllowed = function (obj) {
        switch (obj) {
            case "Да": return "True";
            case "Нет": return "False";
            default:
                throw new Error("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u0435 PetsAllowed: ".concat(obj));
        }
    };
    CianPublisher.prototype.convertFlatRooms = function (obj) {
        switch (obj) {
            case "Студия":
                return 9;
            case "Своб. планировка":
                return 7;
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
                return parseInt(obj, 10);
            case "6":
            case "8":
            case "10 и более":
                return 6; // многокомнатная квартира (более 5 комнат)
            default:
                throw new Error("\u041D\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043D\u043E\u0435 \u0437\u043D\u0430\u0447\u0435\u043D\u0438\u0435 \u043A\u043E\u043C\u043D\u0430\u0442: ".concat(obj));
        }
    };
    CianPublisher.prototype.convertMaterialType = function (obj) {
        switch (obj) {
            case "Блочный": return "block";
            case "Кирпичный": return "bric";
            case "Монолитный": return "monolith";
            case "Монолитно-кирпичный": return "monolithBrick";
            case "Панельный": return "panel";
            case "Деревянный": return "wood";
            default: return null;
        }
    };
    CianPublisher.prototype.transformCategory = function (obj, result) {
        // Преобразование значений для Category
        var copyResult = this.deepCopy(result);
        if (!copyResult) {
            console.debug('copyResult is not valid');
            return false;
        }
        if (obj['Category'] === 'Квартиры') {
            copyResult['Category'] = { _text: 'flatRent' };
        }
        return copyResult;
    };
    CianPublisher.prototype.transformRoomType = function (obj, result) {
        // Преобразование значений для RoomType
        var copyResult = this.deepCopy(result);
        if (!copyResult) {
            console.debug('copyResult is not valid', this.transformRoomType.name);
            return false;
        }
        switch (obj['RoomType']) {
            case 'Изолированные':
                copyResult['RoomType'] = { _text: 'separate' };
                break;
            case 'Совмещенные':
                copyResult['RoomType'] = { _text: 'combined' };
                break;
            default:
                copyResult['RoomType'] = { _text: 'both' };
        }
        return copyResult;
    };
    CianPublisher.prototype.transformRepairType = function (obj, result) {
        var copyResult = this.deepCopy(result);
        if (!copyResult) {
            console.debug('copyResult is not valid', this.transformRoomType.name);
            return false;
        }
        switch (obj['Renovation']) {
            case 'Косметический':
                copyResult['RepairType'] = { _text: 'cosmetic' };
                break;
            case 'Дизайнерский':
                copyResult['RepairType'] = { _text: 'design' };
                break;
            case 'Евроремонт':
                copyResult['RepairType'] = { _text: 'euro' };
                break;
            case 'Без ремонта':
                copyResult['RepairType'] = { _text: 'no' };
                break;
            default:
                copyResult['RepairType'] = { _text: '' };
        }
        return copyResult;
    };
    // Переопределяем условия сделки
    CianPublisher.prototype.convertLeaseType = function (leaseType) {
        switch (leaseType) {
            case 'Посуточно': return 'fewMonths';
            case 'На длительный срок': return 'longTerm';
            default: return '';
        }
    };
    CianPublisher.prototype.convertLeaseDeposit = function (leaseDeposit, price) {
        var priceInt = parseInt(price, 10);
        switch (leaseDeposit.trim()) {
            case 'Без залога': return 0;
            case '0,5 месяца': return Math.round(priceInt * 0.5);
            case '1 месяц': return priceInt;
            case '1,5 месяца': return Math.round(priceInt * 1.5);
            case '2 месяца': return priceInt * 2;
            case '2,5 месяца': return Math.round(priceInt * 2.5);
            case '3 месяца': return priceInt * 3;
            default: return 0;
        }
    };
    CianPublisher.prototype.convertIncludedInPrice = function (obj) {
        // obj['UtilityMeters']
        switch (obj) {
            case 'Оплачивается арендатором':
                return 'False';
            case 'Оплачивается собственником':
                return 'True';
            default:
                return null;
        }
    };
    CianPublisher.prototype.extractValidationResult = function (html) {
        var $ = cheerio_1.default.load(html);
        var resultContainer = $('#validateResultContainer');
        if (resultContainer.length === 0 || resultContainer.css('display') === 'none') {
            return { success: false };
        }
        var resultElement = resultContainer.find('.xmlval_result .success');
        if (resultElement.length > 0) {
            return {
                success: true,
                message: resultElement.text().trim(),
            };
        }
        return { success: false };
    };
    /**
     * Draft Глубокая копия объекта, lodash не хотелось ставить только из-за одной функции
    */
    CianPublisher.prototype.deepCopy = function (obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        var copy;
        if (Array.isArray(obj)) {
            copy = [];
        }
        else {
            copy = {};
        }
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                copy[key] = this.deepCopy(obj[key]);
            }
        }
        return copy;
    };
    // Валидация фида xml на сервисе циана
    CianPublisher.prototype.validXMLFile = function () {
        return __awaiter(this, void 0, void 0, function () {
            var url, response, _response, html, result, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        url = 'https://www.cian.ru/api/validator/validate/';
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.post(url, {
                                url: "url" // Сюда надо прокидывать url xml файла,
                            }, { headers: headers })];
                    case 2:
                        response = _a.sent();
                        if (!response.data) {
                            throw new Error('Данные для дальнейшей валидации не получены');
                        }
                        return [4 /*yield*/, axios_1.default.get("https://www.cian.ru/nd/validator/?Id=".concat(response.data))];
                    case 3:
                        _response = _a.sent();
                        html = _response.data;
                        result = this.extractValidationResult(html);
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
    return CianPublisher;
}());
exports.default = CianPublisher;
