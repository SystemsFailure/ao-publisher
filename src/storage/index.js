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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseStorage = void 0;
var storage_1 = require("firebase/storage");
var app_1 = require("firebase/app");
var storage_2 = require("firebase/storage");
var storage_config_1 = require("../helpers/storage.config");
var appBase = (0, app_1.initializeApp)(storage_config_1.firebaseConfig);
var storage = (0, storage_2.getStorage)(appBase);
var FirebaseStorage = /** @class */ (function () {
    function FirebaseStorage() {
        console.debug('[DATA OF STORAGE] \n', "MAX operationTime: ".concat(storage.maxOperationRetryTime, "  \n"), "MAX uploadTime: ".concat(storage.maxUploadRetryTime, "  \n"));
    }
    // Получить все файлы
    FirebaseStorage.prototype.getAllFiles = function (limit, limit2) {
        return __awaiter(this, void 0, void 0, function () {
            var listRef, firstPage, secondPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listRef = (0, storage_1.ref)(storage, 'files/uid');
                        return [4 /*yield*/, (0, storage_1.list)(listRef, { maxResults: limit })];
                    case 1:
                        firstPage = _a.sent();
                        if (!firstPage.nextPageToken) return [3 /*break*/, 3];
                        return [4 /*yield*/, (0, storage_1.list)(listRef, {
                                maxResults: limit2,
                                pageToken: firstPage.nextPageToken,
                            })];
                    case 2:
                        secondPage = _a.sent();
                        return [2 /*return*/, secondPage];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    // Записать новый файл
    FirebaseStorage.prototype.uploadFile = function (file, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var localRef, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        localRef = (0, storage_1.ref)(storage, fileName);
                        return [4 /*yield*/, (0, storage_1.uploadBytes)(localRef, file)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    FirebaseStorage.prototype.uploadFileByState = function (file, fileName, handler) {
        var fileRef = (0, storage_1.ref)(storage, fileName);
        var uploadTask = (0, storage_1.uploadBytesResumable)(fileRef, file, {
            contentType: "text/xml"
        });
        uploadTask.on('state_changed', function () { }, function (error) {
            console.error("Error uploading file: ", error);
        }, function () {
            (0, storage_1.getDownloadURL)(uploadTask.snapshot.ref).then(function (url) {
                console.log('SEARCH_PATTERN', url, uploadTask.snapshot);
                handler(url, uploadTask.snapshot);
            });
        });
    };
    // Удалить файл
    FirebaseStorage.prototype.deleteFile = function (fileName) {
        var localRef = (0, storage_1.ref)(storage, fileName);
        (0, storage_1.deleteObject)(localRef).then(function () {
            return true;
        }).catch(function (error) {
            console.error(error);
        });
    };
    // Draft - здесь нужно удалять всратый alt - 
    // который введет к скачиванию файла, а не к его доступу по умолчанию
    // Как я понял getDownloadURL() нету возможности менять его
    // Поэтому сделал костыль
    FirebaseStorage.prototype.getFile = function (fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var storage, localRef, url;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        storage = (0, storage_2.getStorage)();
                        localRef = (0, storage_1.ref)(storage, fileName);
                        return [4 /*yield*/, (0, storage_1.getDownloadURL)(localRef)];
                    case 1:
                        url = _a.sent();
                        // Удаляем параметр alt=media из URL
                        // const viewUrl = url.replace('?alt=media&', '?').replace('&alt=media', '');
                        return [2 /*return*/, url];
                }
            });
        });
    };
    // Получить метаданные файла
    FirebaseStorage.prototype.getFileMetadata = function (fileName) {
        var __metadata__ = null;
        var localRef = (0, storage_1.ref)(storage, fileName);
        (0, storage_1.getMetadata)(localRef).then(function (metadata) {
            __metadata__ = metadata;
        }).catch(function (e) { return console.error(e); });
        return __metadata__;
    };
    return FirebaseStorage;
}());
exports.FirebaseStorage = FirebaseStorage;
