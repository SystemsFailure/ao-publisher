import { createHash, randomBytes } from "crypto";
import { AdData } from "../types";

type Constructor<T = {}> = new (...args: any[]) => T;

// Валидация схемы "файла" пока нужна больше для youla и циан
function MixinValidateSchema<M extends Constructor>(Base: M) {
    return class extends Base {
        public validSchema(data: AdData[]) {
            data.forEach((item, index) => {
                if (
                    typeof item.Id !== 'string'
                    || 
                    typeof item.Title !== 'string'
                    || 
                    typeof item.Description !== 'string'
                    || 
                    typeof item.Price !== 'number'
                ) {
                    throw new Error(`Invalid data at index ${index}: Data should match the AdData interface.`);
                } else return true;
            })
        }
    };
}

// генерация уникального значения для id объявления
function MixinGenUniqueHash<M extends Constructor>(Base: M) {
    return class extends Base {
        public generateUniqueId(): string {
            const randomData: string = randomBytes(16).toString('hex'); // Генерация рандомных данных
            const hash: string = createHash('sha256').update(randomData).digest('hex'); // Создание SHA-256 хэша
            return hash;
        }
    };
}

class CombinedClass extends MixinValidateSchema(MixinGenUniqueHash(Object)) {}


export default CombinedClass