import { FileRepository } from '../repositories/FileRepository';
import { IFile } from '../models/File';

export class FileService {
  private fileRepository: FileRepository;

  constructor() {
    this.fileRepository = new FileRepository();
  }

  async createFile(file: IFile): Promise<IFile> {
    // Add any additional validation or business logic here
    return await this.fileRepository.create(file);
  }

  async getFileById(id: string): Promise<IFile | null> {
    return await this.fileRepository.findById(id);
  }

  async getAllFiles(): Promise<IFile[]> {
    return await this.fileRepository.findAll();
  }

  async updateFile(id: string, file: Partial<IFile>): Promise<IFile | null> {
    return await this.fileRepository.update(id, file);
  }

//   async deleteUser(id: string): Promise<IFile | null> {
//     return await this.fileRepository.delete(id);
//   }
}