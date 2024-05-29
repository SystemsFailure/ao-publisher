import {
    ref,
    list,
    uploadBytes,
    deleteObject,
    getDownloadURL,
    getMetadata,
    UploadResult,
    uploadBytesResumable
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

    uploadFileByState(file: any, fileName: string, handler: any) {
      const fileRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(fileRef, file, {
        contentType: "text/xml"
      });
      uploadTask.on('state_changed',
        () => {},
        (error) => {
          console.error("Error uploading file: ", error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            console.log('SEARCH_PATTERN', url, uploadTask.snapshot);
            handler(url, uploadTask.snapshot)
          });
        },
      );
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
    
    // Draft - здесь нужно удалять всратый alt - 
    // который введет к скачиванию файла, а не к его доступу по умолчанию
    // Как я понял getDownloadURL() нету возможности менять его
    // Поэтому сделал костыль
    async getFile(fileName: string) {
      const storage = getStorage();
      const localRef = ref(storage, fileName);
      const url = await getDownloadURL(localRef);
    
      // Удаляем параметр alt=media из URL
      // const viewUrl = url.replace('?alt=media&', '?').replace('&alt=media', '');
    
      return url;
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