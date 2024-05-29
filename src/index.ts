import express, { Request, Response } from 'express';
import axios, { AxiosResponse } from 'axios';
import xlsx from 'xlsx';
import multer from 'multer';
import { AdData } from './types';
import { publishAds } from './strategy/ContextStrategy';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Database } from './database/utils/Database';
// import CombinedClass from './mixins/context.mixin';

// extends CombinedClass
class Publisher {
  public ads: AdData[];
  protected accessToken: string;

  constructor() {
    // super();
    this.ads = [];
    this.accessToken = '';
  }

  // Чтения Excel таблицы
  public readExcel(filePath: string = './src/excel/01.xlsx'): void {
    const workbook: xlsx.WorkBook = xlsx.readFile(filePath);
    const sheetName: string = workbook.SheetNames[0];
    const worksheet: xlsx.WorkSheet = workbook.Sheets[sheetName];
    const jsonData: AdData[] = xlsx.utils.sheet_to_json(worksheet);
    this.ads = jsonData;
  }

  // Публикации объявления
  public async postAds(): Promise<void> {
    for (const ad of this.ads) {
      try {
        const response: AxiosResponse<any, any> = await axios.post('https://api.avito.ru/createAd', {
          title: ad.Title,
          description: ad.Description,
          price: ad.Price,
          category: ad.Category,
          location: ad.Address,
        });

        console.log(`Ad posted successfully: ${response.data}`);
      } catch (error) {
        console.error(`Error posting ad: ${error}`);
      }
    }
  }
}

// Настройка CORS
const corsOptions = {
  origin: '*', // Разрешить запросы с любых источников. Можно указать конкретные домены
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Указываем разрешенные методы
  allowedHeaders: ['Content-Type', 'Authorization'] // Указываем разрешенные заголовки
};

const app = express();
const port = 3000;

app.use(express.json())
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

// Настройка multer для сохранения загруженных файлов
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
    cb(null, 'src/excel'); // Путь к папке для сохранения файлов
  },
  filename: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: string) => void) {
    const fileName = `${Date.now()}_${file.originalname}`
    console.log(fileName)
    cb(null, fileName); // Имя файла
  }
});

const upload: multer.Multer = multer({ storage: storage });

type GenericObject = { [key: string]: any };

// Функция для замены ключей в объекте
const transformKeys = (obj: GenericObject): GenericObject => {
  const transformedObj: GenericObject = {};

  for (const [key, value] of Object.entries(obj)) {
    // Разделяем ключ по "||" и берем часть после знака
    const newKey = key.split('||')[1]?.trim() || key;
    transformedObj[newKey] = typeof value === 'string' ? value.trim() : value;
  }

  return transformedObj;
};

// Функция для обработки массива объектов
const transformArray = (arr: GenericObject[]): GenericObject[] => {
  return arr.map(transformKeys);
};

/**
 * Запросы
 */

app.post('/upload-json', (req: Request, res: Response) => {
  const jsonObjectString = req.body.jsonObject;
  let listAds;
  try {
    listAds = JSON.parse(jsonObjectString);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON format' });
  }

  const transformedArr: GenericObject[] = transformArray(listAds);
  publishAds(transformedArr)

  console.log('Данные : ', listAds);

  res.json({ message: 'JSON received successfully', data: "dwijaroierteryjk" });
});

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const filePath: string = req.file.path;
  res.send({
    result: {},
    success: true,
  });
});

app.post('/publish', async (req: Request, res: Response) => {
  const avitoPoster: Publisher = new Publisher();

  avitoPoster.readExcel('./src/excel/1716544484326_Шаблон01.xlsx');
  const transformedArr: GenericObject[] = transformArray(avitoPoster.ads);

  // console.log(transformedArr);
  publishAds(transformedArr)

  res.send('Ads have been posted successfully');
});

// app.post('/upload-excel', (req: Request, res: Response) => {
//   // Запрос для сохранения 
// })

app.post('/upload-ads-files', (req: Request, res: Response) => {
  // Запрос на сохранения файлов в mongo для объектов
})

Database.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});