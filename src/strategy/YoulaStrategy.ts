import axios, { AxiosResponse } from "axios";
import { PublisherStrategy } from "./types";
import * as fs from 'fs';
import FormData from 'form-data';
import { ConvertInXMLOptions } from "../types";
import * as xmljs from 'xml-js';

export default class YoulaPublisher implements PublisherStrategy {
    convert(adsData: any): any { return this.convertedInXML(adsData); }
    publish(data: any): any { return this.public(data); }
  
    private convertedInXML(data: any, options: ConvertInXMLOptions = {}): any {
      if (typeof data !== 'object' && typeof data !== 'string') {
        throw new Error('Unsupported data type. Expected object or string.');
      }

      if (typeof data === 'object') {
          data = JSON.stringify(data);
      }

      const xmlOptions = options.xmlOptions || { compact: true, ignoreComment: true, spaces: 4 };
      const outputPath = options.outputPath || 'src/tmp/xml';
      const fileName = options.fileName || 'output.xml';

      try {
          const xml: string = xmljs.json2xml(JSON.parse(data), xmlOptions);
          if (!fs.existsSync(outputPath)) {
              fs.mkdirSync(outputPath, { recursive: true });
          }
          fs.writeFileSync(`${outputPath}/${fileName}`, xml);
          console.log('XML файл успешно создан');
      } catch (error) {
          console.error('Ошибка при создании XML файла:', error);
      }
    }
  
    // Данная пубиликация сделана через отправку сформированного файла через почту
    private async public(filePath: string): Promise<AxiosResponse<any, any> | undefined> {
      try {
        const fileStream = fs.createReadStream(filePath);
        
        const formData = new FormData();
        formData.append('file', fileStream, filePath);
  
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        };
  
        const response: AxiosResponse = await axios.post(
          'http://your-server-endpoint/upload', 
          formData, 
          config
        );

        return response;
      } catch (error) {
        console.log(error)
      }
    }

    public async getObjects(cityId: string, category: string) {
      const result: any[] = [];
      const page: number = 1;
      const response = await axios({
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
                        value: [`${category}`],
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
                cursor: `{"page":${page}}`,
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash:
                        "6e7275a709ca5eb1df17abfb9d5d68212ad910dd711d55446ed6fa59557e2602",
                },
            },
        },
      });
      response.data.data.feed.items
        .filter((el: any) => !!el)
        .forEach((el: any) => result.push(el.product));
    }
}