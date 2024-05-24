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
var axios_1 = __importDefault(require("axios"));
var fs = __importStar(require("fs"));
var form_data_1 = __importDefault(require("form-data"));
var xmljs = __importStar(require("xml-js"));
var YoulaPublisher = /** @class */ (function () {
    function YoulaPublisher() {
    }
    YoulaPublisher.prototype.convert = function (adsData) { return this.convertedInXML(adsData); };
    YoulaPublisher.prototype.publish = function (data) { return this.public(data); };
    YoulaPublisher.prototype.valid = function (filePath) { return this.validXMLFile(); };
    YoulaPublisher.prototype.convertedInXML = function (data, options) {
        if (options === void 0) { options = {}; }
        if (typeof data !== 'object' && typeof data !== 'string') {
            throw new Error('Unsupported data type. Expected object or string.');
        }
        if (typeof data === 'object') {
            data = JSON.stringify(data);
        }
        var xmlOptions = options.xmlOptions || { compact: true, ignoreComment: true, spaces: 4 };
        var outputPath = options.outputPath || 'src/tmp/xml';
        var fileName = options.fileName || 'output.xml';
        try {
            var xml = xmljs.json2xml(JSON.parse(data), xmlOptions);
            if (!fs.existsSync(outputPath)) {
                fs.mkdirSync(outputPath, { recursive: true });
            }
            fs.writeFileSync("".concat(outputPath, "/").concat(fileName), xml);
            console.log('XML файл успешно создан');
        }
        catch (error) {
            console.error('Ошибка при создании XML файла:', error);
        }
    };
    YoulaPublisher.prototype.validXMLFile = function () {
    };
    // Данная пубиликация сделана через отправку сформированного файла через почту
    YoulaPublisher.prototype.public = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var fileStream, formData, config, response, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        fileStream = fs.createReadStream(filePath);
                        formData = new form_data_1.default();
                        formData.append('file', fileStream, filePath);
                        config = {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        };
                        return [4 /*yield*/, axios_1.default.post('http://your-server-endpoint/upload', formData, config)];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response];
                    case 2:
                        error_1 = _a.sent();
                        console.log(error_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    YoulaPublisher.prototype.getObjects = function (cityId, category) {
        return __awaiter(this, void 0, void 0, function () {
            var result, page, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        result = [];
                        page = 1;
                        return [4 /*yield*/, (0, axios_1.default)({
                                method: "POST",
                                url: "https://api-gw.youla.io/federation/graphql",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                data: {
                                    operationName: "catalogProductsBoard",
                                    variables: {
                                        sort: "DEFAULT",
                                        attributes: [
                                            {
                                                slug: "categories",
                                                value: ["".concat(category)],
                                                from: null,
                                                to: null,
                                            },
                                        ],
                                        datePublished: null,
                                        location: {
                                            latitude: null,
                                            longitude: null,
                                            city: cityId,
                                            distanceMax: null,
                                        },
                                        search: "",
                                        cursor: "{\"page\":".concat(page, "}"),
                                    },
                                    extensions: {
                                        persistedQuery: {
                                            version: 1,
                                            sha256Hash: "6e7275a709ca5eb1df17abfb9d5d68212ad910dd711d55446ed6fa59557e2602",
                                        },
                                    },
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        response.data.data.feed.items
                            .filter(function (el) { return !!el; })
                            .forEach(function (el) { return result.push(el.product); });
                        return [2 /*return*/];
                }
            });
        });
    };
    return YoulaPublisher;
}());
exports.default = YoulaPublisher;
