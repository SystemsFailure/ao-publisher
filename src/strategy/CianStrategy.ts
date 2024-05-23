import { PublisherStrategy } from "./types";
import * as xmljs from 'xml-js';
import * as fs from 'fs';

interface AdObject {
  Id: number;
  [key: string]: any; // Позволяет иметь произвольное количество ключей
}

export default class CianPublisher implements PublisherStrategy {
    convert(adsData: any): any { return this.convertedInXML(adsData); }
    publish(data: any): any { return this.public(data); }

    // Реализация
    private public(data: any): any {
      // реализация публикации
    }
  
    private convertedInXML(objects: any): any {
      // adsData - это объект, который получается из основного excel файла
      // в adsData попадают только те объекты, у которых platform = 'Циан'
      // далее он сопостовляется с необходимой структурой фида Циана
      // потом конвертируется в XML файл, который отправляется на почту циана, позже, если все
      // отлично - начинается выгрузка всех обектов, из ранее сформированного фида
      const json = this.convertKeysJson(objects);
      const xml: string = xmljs.js2xml(json, { compact: true, spaces: 4 });
      fs.writeFileSync('src/tmp/converted/xml/cian/output.xml', xml);
      console.log('successfuly formated in xml cian')
    }
    
    private convertKeysJson(objects: AdObject[]): any {
      return {
        feed: {
          feed_version: 2,
          object: objects.map(obj => {
            const result: any = {};
    
            // Прямое сопоставление
            result['ExternalId'] = { _text: String(obj['Id']).toString().trim() };
            result['Category'] = { _text: obj['Category'].toString().trim() };
            result['Description'] = { _text: obj['Description'].toString().trim() };
            result['Address'] = { _text: obj['Address'].toString().trim() };
            result['BargainTerms'] = {
              Price: { _text: obj['Price']  }
            }
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
                Number: { _text: `+${obj['ContactPhone'].split('|')[0]}`.toString().trim() },
              }
            };
            result['RoomArea'] = { _text: obj['RoomArea'] };

            return result;
          })
        }
      };
    }
}