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
Object.defineProperty(exports, "__esModule", { value: true });
var xmljs = __importStar(require("xml-js"));
var fs = __importStar(require("fs"));
var CianPublisher = /** @class */ (function () {
    function CianPublisher() {
    }
    CianPublisher.prototype.convert = function (adsData) { return this.convertedInXML(adsData); };
    CianPublisher.prototype.publish = function (data) { return this.public(data); };
    CianPublisher.prototype.valid = function (filePath) { };
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
        var json = this.convertKeysJson(objects);
        var xml = xmljs.js2xml(json, { compact: true, spaces: 4 });
        fs.writeFileSync('src/tmp/converted/xml/cian/output.xml', xml);
        console.log('successfuly formated in xml cian');
    };
    CianPublisher.prototype.convertKeysJson = function (objects) {
        return {
            feed: {
                feed_version: 2,
                object: objects.map(function (obj) {
                    var result = {};
                    // Прямое сопоставление
                    result['ExternalId'] = { _text: String(obj['Id']).toString().trim() };
                    result['Category'] = { _text: obj['Category'].toString().trim() };
                    result['Description'] = { _text: obj['Description'].toString().trim() };
                    result['Address'] = { _text: obj['Address'].toString().trim() };
                    result['BargainTerms'] = {
                        Price: { _text: obj['Price'] }
                    };
                    result['RoomType'] = { _text: obj['RoomType'].toString().trim() };
                    result['RepairType'] = { _text: obj['Renovation'].toString().trim() };
                    // PropertyRights пропускаем
                    result['BargainTerms'] = {
                        LeaseTermType: { _text: obj['LeaseType'].toString().trim() }
                    };
                    result['Building'] = {
                        MaterialType: { _text: obj['HouseType'].toString().trim() }
                    };
                    result['FloorNumber'] = { _text: obj['Floor'] };
                    result['Building'] = {
                        FloorsCount: { _text: obj['Floors'] }
                    };
                    result['FlatRoomsCount'] = { _text: obj['Rooms'] };
                    result['TotalArea'] = { _text: obj['Square'] };
                    result['BargainTerms'] = {
                        Deposit: { _text: obj['LeaseDeposit'] }
                    };
                    result['BargainTerms'] = {
                        ClientFee: { _text: obj['LeaseCommissionSize'] }
                    };
                    result['KitchenArea'] = { _text: obj['KitchenSpace'] };
                    result['BargainTerms'] = {
                        UtilitiesTerms: {
                            IncludedInPrice: { _text: obj['UtilityMeters'] }
                        }
                    };
                    // OtherUtilities пропускаем
                    result['BargainTerms'] = {
                        UtilitiesTerms: {
                            Price: { _text: obj['OtherUtilitiesPayment'] }
                        }
                    };
                    // SmokingAllowed пропускаем
                    result['ChildrenAllowed'] = { _text: obj['ChildrenAllowed'] };
                    result['PetsAllowed'] = { _text: obj['PetsAllowed'] };
                    result['Phones'] = {
                        PhonesSchema: {
                            CountryCode: { _text: obj['ContactPhone'].split('|')[1].toString().trim() },
                            Number: { _text: "+".concat(obj['ContactPhone'].split('|')[0]).toString().trim() },
                        }
                    };
                    result['RoomArea'] = { _text: obj['RoomArea'] };
                    return result;
                })
            }
        };
    };
    return CianPublisher;
}());
exports.default = CianPublisher;
