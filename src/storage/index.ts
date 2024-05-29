import {
    ref,
    list,
    uploadBytes,
    uploadBytesResumable,
    deleteObject,
    getDownloadURL,
    getMetadata
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
    uploadFile(file: any, fileName: any) {
      const metadata = {
        contentType: 'image/jpeg',
      };
      const localRef = ref(storage, fileName)
      uploadBytes(localRef, file, metadata).then((snapshot: any) => {
        console.log('Uploaded a blob or file!', snapshot);
      });
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
  
    // Получить один файл
    getFile(fileName: any) {
      let __URL__ = null;
      const localRef = ref(storage, fileName);
      getDownloadURL(localRef).then((url: any) => {
        const __httpx__ = new XMLHttpRequest();
        __httpx__.responseType = 'blob';
        __httpx__.open('GET', url)
        __httpx__.send();
        __URL__ = url
      })
      return __URL__;
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