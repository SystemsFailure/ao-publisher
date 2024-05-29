import {
    ref,
    list,
    uploadBytes,
    deleteObject,
    getDownloadURL,
    getMetadata,
    UploadResult
} from "firebase/storage";

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { firebaseConfig } from "../helpers/storage.config";


const appBase = initializeApp(firebaseConfig);
const storage = getStorage(appBase)

export class FirebaseStorage {
    constructor() {
      console.debug(
            '[DATA OF STORAGE] \n',
            `MAX operationTime: ${storage.maxOperationRetryTime}  \n`,
            `MAX uploadTime: ${storage.maxUploadRetryTime}  \n`,
        )
    }
  
    // Получить все файлы
    async getAllFiles(limit: any, limit2: any) {
      const listRef = ref(storage, 'files/uid');

      const firstPage = await list(listRef, { maxResults: limit });

      if (firstPage.nextPageToken) {
        const secondPage = await list(listRef, {
          maxResults: limit2,
          pageToken: firstPage.nextPageToken,
        });
        return secondPage
      }
    }
  
    // Записать новый файл
    async uploadFile(file: any, fileName: any) {
      const localRef = ref(storage, fileName)
      const result: UploadResult = await uploadBytes(localRef, file)
      return result;
    }

    // Удалить файл
    deleteFile(fileName: any) {
      const localRef = ref(storage, fileName);
      deleteObject(localRef).then(() => {
        return true;
      }).catch((error: any) => {
        console.error(error);
      });
    }
  
    async getFile(fileName: string) {
      let URL;
      const localRef = ref(storage, fileName);
      const url = await getDownloadURL(localRef);
      URL = url;
      return URL;
    }
  
    // Получить метаданные файла
    getFileMetadata(fileName: any) {
      let __metadata__ = null;
      const localRef = ref(storage, fileName);
      getMetadata(localRef).then((metadata: any) => {
        __metadata__ = metadata;
      }).catch(e => console.error(e))
      return __metadata__;
    }
}