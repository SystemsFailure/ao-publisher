import { PublisherStrategy } from "./types";
import * as xmljs from 'xml-js';
import * as fs from 'fs';
import axios from "axios";
import cheerio from 'cheerio';
import { createHash, randomBytes } from "crypto";
import { headers } from "../helpers/cian.headers";
import { FirebaseStorage } from "../storage";
import { UploadResult } from "firebase/storage";
import { IFile } from "../database/models/File";
import { FileService } from "../database/services/FileService";

interface AdObject {
  Id: number;
  [key: string]: any; // Позволяет иметь произвольное количество ключей
};
interface ValidationResult {
  success: boolean;
  message?: string;
};

interface IFileData {
  storagePath: string,
  name: string,
  localPath: string,
  size: number
}

function generateUniqueId(): string {
  const randomData: string = randomBytes(16).toString('hex'); // Генерация рандомных данных
  const hash: string = createHash('sha256').update(randomData).digest('hex'); // Создание SHA-256 хэша
  return hash;
}

export default class CianPublisher implements PublisherStrategy {
    convert(adsData: any): any { return this.convertedInXML(adsData); }
    publish(data: any): any { return this.public(data); }
    valid(): any {}

    // Реализация
    private async public(filePath: string): Promise<any> {
      const result: IFileData = await this.saveFileInStorage(filePath);
      const row: IFile = await this.saveFileInDatabase(result)
      console.log('Файл успешно сохранен, его данные:' , result);
      console.log('row: ', row)

      // Здесь записываем файл в storage
      // Также сохраняем его в mongodb
      // Далее прописываем логику публикации, через отправку ссылки на почту import@cian.ru

    }

    private async saveFileInStorage(filePath: string): Promise<IFileData> {
      const file: Buffer = fs.readFileSync(filePath)
      const storage: FirebaseStorage = new FirebaseStorage();
      const fileName: string = filePath.split('_')[1];
      if(!fileName) {
        throw new Error('Не получилось извлечь имя файла')
      }
      const result: UploadResult = await storage.uploadFile(file, `files/xml/cian/${fileName}`);
      const url: string = await storage.getFile(result.metadata.fullPath);

      return {
        storagePath: url,
        name: result.metadata.name,
        localPath: filePath,
        size: result.metadata.size,
      };
    }

    private async saveFileInDatabase(data: IFileData) {
      const fileService: FileService = new FileService();
      const result: IFile = await fileService.createFile(data);
      if(!result) {
        throw new Error(`Результат записи файла в базу данных : ${result}`);
      }
      console.debug("Данный файл успешно записан в базу данных");
      return result;
    }
  
    private convertedInXML(objects: any) {
      const json = this.transformJson(objects);
      const xml: string = xmljs.js2xml(json, { compact: true, spaces: 4 });
      
      const fileName: string = `src/tmp/converted/xml/cian/_${generateUniqueId()}.xml`

      fs.writeFileSync(fileName, xml);
      console.debug('successfuly formated in xml cian')
      
      return fileName;
    }
    
    private transformJson(objects: AdObject[]) {
      return {
        feed: {
          feed_version: 2,
          object: objects.map(obj => {
            let result: any = {};
    
            // Прямое сопоставление
            result['ExternalId'] = { _text: String(obj['Id']).toString().trim() };

            let transformResult = this.transformCategory(obj, result)
            if(!transformResult) {
              return;
            }
            result['Category'] = transformResult['Category']

            result['Description'] = { _text: obj['Description'].toString().trim() };
            result['Address'] = { _text: obj['Address'].toString().trim() };

            transformResult = this.transformRoomType(obj, result);
            if(!transformResult) {
              return
            }
            result['RoomType'] = transformResult['RoomType']
            
            transformResult = this.transformRepairType(obj, result);
            if(!transformResult) {
              return
            }
            result['RepairType'] = transformResult['RepairType']

            // PropertyRights пропускаем

            result['BargainTerms'] = {
              LeaseTermType: { _text: this.convertLeaseType(obj['LeaseType']) },
              Price: { _text: parseFloat(obj['Price']) },
              Deposit: { _text: this.convertLeaseDeposit(obj['LeaseDeposit'], obj['Price']) },
              UtilitiesTerms: { 
                  IncludedInPrice: { _text: this.convertIncludedInPrice(obj['UtilityMeters']) },
                  Price: { _text: parseInt(obj['OtherUtilitiesPayment'], 10) }
              },
              ClientFee: { _text: obj['LeaseCommissionSize'] }
            };


            result['Building'] = {
              MaterialType: { _text: this.convertMaterialType(obj['HouseType']) },
              FloorsCount: { _text: obj['Floors'] }
            };
            result['FloorNumber'] = { _text: obj['Floor'] };
            result['FlatRoomsCount'] = { _text: this.convertFlatRooms(obj['Rooms']) };
            result['TotalArea'] = { _text: obj['Square'] };
            result['KitchenArea'] = { _text: obj['KitchenSpace'] };
            result['ChildrenAllowed'] = { _text: this.convertChildrenAllowed(obj['ChildrenAllowed']) };
            result['PetsAllowed'] = { _text: this.convertPetsAllowed(obj['PetsAllowed']) };
            result['Phones'] = {
              PhoneSchema: { 
                CountryCode: { _text: `+${obj['ContactPhone'].split('|')[0]}`.toString().trim() },
                Number: { _text: obj['ContactPhone'].split('|')[1].toString().trim() },
              }
            };
            result['RoomArea'] = { _text: obj['RoomArea'] };

            return result;
          })
        }
      };
    }

    private convertChildrenAllowed(obj: any) {
      switch (obj) {
        case "Да": return "True"
        case "Нет": return "False"
        default:
          throw new Error(`Неизвестно разрешение childredAllowed: ${obj}`);
      }
    }

    private convertPetsAllowed(obj: any) {
      switch (obj) {
        case "Да": return "True"
        case "Нет": return "False"
        default:
          throw new Error(`Неизвестно разрешение PetsAllowed: ${obj}`);
      }
    }

    private convertFlatRooms(obj: any): number {
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
          throw new Error(`Неизвестное значение комнат: ${obj}`);
      }
    }

    private convertMaterialType(obj: any) {
      switch (obj) {
        case "Блочный": return "block"
        case "Кирпичный": return "bric"
        case "Монолитный": return "monolith"
        case "Монолитно-кирпичный": return "monolithBrick"
        case "Панельный": return "panel"
        case "Деревянный": return "wood" 
        default: return null
      }
    }

    private transformCategory(obj: any, result: any) {
      // Преобразование значений для Category
      const copyResult = this.deepCopy(result)

      if(!copyResult) {
        console.debug('copyResult is not valid')
        return false
      }

      if (obj['Category'] === 'Квартиры') {
        copyResult['Category'] = { _text: 'flatRent' };
      }

      return copyResult
    }

    private transformRoomType(obj: any, result: any) {
      // Преобразование значений для RoomType
      const copyResult = this.deepCopy(result);

      if(!copyResult) {
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
    }

    private transformRepairType(obj: any, result: any) {
      const copyResult = this.deepCopy(result);

      if(!copyResult) {
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
    }

    // Переопределяем условия сделки
    private convertLeaseType(leaseType: string): string {
      switch (leaseType) {
          case 'Посуточно': return 'fewMonths';
          case 'На длительный срок': return 'longTerm';
          default: return '';
      }
    }

    private convertLeaseDeposit(leaseDeposit: string, price: string): number {
      const priceInt = parseInt(price, 10);
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
    }

    private convertIncludedInPrice(obj: any) {
      // obj['UtilityMeters']
      switch (obj) {
        case 'Оплачивается арендатором':
          return 'False';
        case 'Оплачивается собственником':
          return 'True';
        default:
          return null;
      }
    }

    private extractValidationResult(html: string): ValidationResult {
      const $ = cheerio.load(html);
    
      const resultContainer = $('#validateResultContainer');
      if (resultContainer.length === 0 || resultContainer.css('display') === 'none') {
        return { success: false };
      }
    
      const resultElement = resultContainer.find('.xmlval_result .success');
      if (resultElement.length > 0) {
        return {
          success: true,
          message: resultElement.text().trim(),
        };
      }
    
      return { success: false };
    }

    /** 
     * Draft Глубокая копия объекта, lodash не хотелось ставить только из-за одной функции
    */
    private deepCopy(obj: any): any {
      if (obj === null || typeof obj !== 'object') {
          return obj;
      }

      let copy: any;
      if (Array.isArray(obj)) {
          copy = [];
      } else {
          copy = {} as Record<string, any>;
      }

      for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
              copy[key] = this.deepCopy(obj[key]);
          }
      }

      return copy;
    }
    
    // Валидация фида xml на сервисе циана
    async validXMLFile() {
      const url = 'https://www.cian.ru/api/validator/validate/';

      // Remembership: Нужно делать записи xml файла в mongodb с его uid и url после сохранения в удаленном хранилище
      try {
        const response = await axios.post(url, {
          url: "url" // Сюда надо прокидывать url xml файла,
        }, { headers });
  
        if(!response.data) {
          throw new Error('Данные для дальнейшей валидации не получены')
        }
  
        const _response = await axios.get(`https://www.cian.ru/nd/validator/?Id=${response.data}`)
  
        const html = _response.data;
        const result: ValidationResult = this.extractValidationResult(html)
        console.log('Результат провекри xml фида для avito: ', result);
      } catch (error) {
        console.error('Error uploading file:', error);
      }
    }
}