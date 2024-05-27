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
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
var xlsx_1 = __importDefault(require("xlsx"));
var multer_1 = __importDefault(require("multer"));
var ContextStrategy_1 = require("./strategy/ContextStrategy");
// import CombinedClass from './mixins/context.mixin';
// extends CombinedClass
var Publisher = /** @class */ (function () {
    function Publisher() {
        // super();
        this.ads = [];
        this.accessToken = '';
    }
    // Чтения Excel таблицы
    Publisher.prototype.readExcel = function (filePath) {
        if (filePath === void 0) { filePath = './src/excel/01.xlsx'; }
        var workbook = xlsx_1.default.readFile(filePath);
        var sheetName = workbook.SheetNames[0];
        var worksheet = workbook.Sheets[sheetName];
        var jsonData = xlsx_1.default.utils.sheet_to_json(worksheet);
        this.ads = jsonData;
    };
    // Публикации объявления
    Publisher.prototype.postAds = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _i, _a, ad, response, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _i = 0, _a = this.ads;
                        _b.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 6];
                        ad = _a[_i];
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, axios_1.default.post('https://api.avito.ru/createAd', {
                                title: ad.Title,
                                description: ad.Description,
                                price: ad.Price,
                                category: ad.Category,
                                location: ad.Address,
                            })];
                    case 3:
                        response = _b.sent();
                        console.log("Ad posted successfully: ".concat(response.data));
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _b.sent();
                        console.error("Error posting ad: ".concat(error_1));
                        return [3 /*break*/, 5];
                    case 5:
                        _i++;
                        return [3 /*break*/, 1];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return Publisher;
}());
var app = (0, express_1.default)();
var port = 3000;
// Настройка multer для сохранения загруженных файлов
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/excel'); // Путь к папке для сохранения файлов
    },
    filename: function (req, file, cb) {
        var fileName = "".concat(Date.now(), "_").concat(file.originalname);
        console.log(fileName);
        cb(null, fileName); // Имя файла
    }
});
var upload = (0, multer_1.default)({ storage: storage });
// Функция для замены ключей в объекте
var transformKeys = function (obj) {
    var _a;
    var transformedObj = {};
    for (var _i = 0, _b = Object.entries(obj); _i < _b.length; _i++) {
        var _c = _b[_i], key = _c[0], value = _c[1];
        // Разделяем ключ по "||" и берем часть после знака
        var newKey = ((_a = key.split('||')[1]) === null || _a === void 0 ? void 0 : _a.trim()) || key;
        transformedObj[newKey] = typeof value === 'string' ? value.trim() : value;
    }
    return transformedObj;
};
// Функция для обработки массива объектов
var transformArray = function (arr) {
    return arr.map(transformKeys);
};
/**
 * Запросы
 */
app.post('/upload', upload.single('file'), function (req, res) {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    var filePath = req.file.path;
    res.send({
        result: {},
        success: true,
    });
});
app.post('/publish', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var avitoPoster, transformedArr;
    return __generator(this, function (_a) {
        avitoPoster = new Publisher();
        avitoPoster.readExcel('./src/excel/1716544484326_Шаблон01.xlsx');
        transformedArr = transformArray(avitoPoster.ads);
        // console.log(transformedArr);
        (0, ContextStrategy_1.publishAds)(transformedArr);
        res.send('Ads have been posted successfully');
        return [2 /*return*/];
    });
}); });
app.get('');
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port, "/"));
});
