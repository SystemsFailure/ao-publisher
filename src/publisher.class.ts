import { AdData } from "./types";
import xlsx from 'xlsx';

export class Publisher {
    public ads: AdData[];
    protected accessToken: string;
  
    constructor() {
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
}