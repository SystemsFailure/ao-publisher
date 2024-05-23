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