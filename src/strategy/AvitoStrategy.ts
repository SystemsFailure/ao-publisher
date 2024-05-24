import axios, { AxiosError } from 'axios';
import { PublisherStrategy } from "./types";
import { AuthorizationResponse, Credentials } from '../types';
import * as xmljs from 'xml-js';
import * as fs from 'fs';

interface AdObject {
  Id: string;
  [key: string]: any; // Позволяет иметь произвольное количество ключей
}

export default class AvitoPublisher implements PublisherStrategy {
  protected accessToken: string;
  // DI
  private authService: AuthService;

  constructor() {
    this.accessToken = '';
    this.authService = new AuthService();
  }

  convert(adsData: any): any { return this.convertedInXML(adsData); }
  publish(data: any): any { return this.public(data); }
  valid(filePath: string) { return this.validXMLFile() }

  // Реализация
  public checkExcelFile() {}

  private convertedInXML(objects: any): any {
    const json = this.convertKeysJson(objects);
    const xml: string = xmljs.js2xml(json, { compact: true, spaces: 4 });
    fs.writeFileSync('src/tmp/converted/xml/avito/output.xml', xml);
    console.log('successfuly formated in xml avito')
  }

  private public(data: any): any {
    // Реализация публикации
  }

  // Парсим html результат валидации
  private parseHtmlResponse(htmlString: string) : true | number {
    const parser: DOMParser = new DOMParser();
    const doc: Document = parser.parseFromString(htmlString, 'text/html');
    
    const rows: NodeListOf<Element> = doc.querySelectorAll('table.report tbody tr');
  
    // Преобразуем NodeList в массив
    const rowsArray: Element[] = Array.from(rows);
  
    for (const row of rowsArray) {
      const statusSpan = row.querySelector('td span.is-green');
      const itemIdElement = row.querySelector('td.item-id');
      
      if (!statusSpan || statusSpan.textContent !== 'Соответствует формату') {
        if (itemIdElement) {
          const itemId: number = parseInt(itemIdElement.textContent || '0', 10);
          return itemId;
        }
      }
    }
    
    return true;
  }

  // Валидация xml фида через авито xml валидатор
  private async validXMLFile(filePath: string = 'src/tmp/converted/xml/avito/output.xml') {
    const url = 'https://autoload.avito.ru/api/v2/public/xml_checker/upload/';
    
    const headers = {
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
  
    const xmlData: string = fs.readFileSync(
      filePath,
      // path.resolve(__dirname, filePath), 
      'utf-8'
    );
  
    try {
      const response = await axios.post(url, xmlData, { headers });
      const html = response.data;
      const result: number | true = this.parseHtmlResponse(html)
      console.log(result);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  // access_token для авито
  public async authorization(creditionals: { client_id: string, client_secret: string }, grant_type: string = "client_credentials") {
    const { data } = await axios.post('https://api.avito.ru/token', {
      ...creditionals,
      grant_type: grant_type
    });
    if (!data.access_token) return;

    this.accessToken = data.access_token;

    return this.accessToken;
  }

  // Работает по обратной схеме в отличие от CianStrategy
  private convertKeysJson(objects: AdObject[]): any {
    return {
      Ads: {
        _attributes: {
          formatVersion: "3",
          target: "Avito.ru"
        },
        Ad: objects.map(obj => {
          const result: any = {};
          const splitedContactPhone: string[] = String(obj['ContactPhone']).split('|');
          
          // Список ключей, которые мы хотим исключить
          const excludedKeys: string[] = ['Площадка', 'RoomArea'];
          
          for (const key in obj) {
            if (obj.hasOwnProperty(key) && !excludedKeys.includes(key)) {
              if (key === 'ContactPhone') {
                result['ContactPhone'] = {
                  _text: `
                    +${splitedContactPhone[0].toString().trim()} ${splitedContactPhone[1].toString().trim()}
                  `
                };
              } else {
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
  }
}


class AuthService {
  private accessToken: string | null = null;
  private static readonly API_URL: string = 'https://api.avito.ru/token';
  private static readonly GRANT_TYPE: string = 'client_credentials';

  public async authorization(credentials: Credentials, grant_type: string = AuthService.GRANT_TYPE): Promise<string | void> {
    if (!credentials.client_id || !credentials.client_secret) {
      throw new Error('Missing client_id or client_secret in credentials');
    }

    try {
      const { data } = await axios.post<AuthorizationResponse>(AuthService.API_URL, {
        ...credentials,
        grant_type
      });

      if (!data.access_token) {
        console.error('No access_token received');
        return;
      }

      this.accessToken = data.access_token;
      return this.accessToken;
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // Сервер вернул ответ с кодом, отличным от 2xx
        console.error('Error response from server:', axiosError.response.data);
      } else if (axiosError.request) {
        // Запрос был сделан, но ответа не получено
        console.error('No response received:', axiosError.request);
      } else {
        // Произошла ошибка при настройке запроса
        console.error('Error setting up request:', axiosError.message);
      }
      console.error('Error details:', axiosError.config);
    }
  }
}