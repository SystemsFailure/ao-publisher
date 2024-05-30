import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Database } from './database/utils/Database';
import { upload } from './helpers/multer.config';
import { uploadJsonController } from './controllers/upload.json.controller';
import { publishController } from './controllers/publish.controller';
import { uploadFileController } from './controllers/upload.file.controller';
import { corsOptions } from './helpers/cors.config';
import { uploadAdsFilesController } from './controllers/upload.ads.files.controller';

// инициализация и определения
const app = express();
const port = 3000;

// миделвары
app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * запросы
 */
app.post('/upload-json', uploadJsonController);
app.post('/upload', upload.single('file'), uploadFileController);
app.post('/publish', publishController);
app.post('/upload-ads-files', uploadAdsFilesController);

// запуск
Database.connect().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});