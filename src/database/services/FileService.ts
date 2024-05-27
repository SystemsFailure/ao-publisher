import { FileRepository } from '../repositories/FileRepository';
import { IFile } from '../models/File';

export class UserService {
  private fileRepository: FileRepository;

  constructor() {
    this.fileRepository = new FileRepository();
  }

  async createUser(user: IFile): Promise<IFile> {
    // Add any additional validation or business logic here
    return await this.fileRepository.create(user);
  }

  async getUserById(id: string): Promise<IFile | null> {
    return await this.fileRepository.findById(id);
  }

  async getAllUsers(): Promise<IFile[]> {
    return await this.fileRepository.findAll();
  }

  async updateUser(id: string, user: Partial<IFile>): Promise<IFile | null> {
    return await this.fileRepository.update(id, user);
  }

//   async deleteUser(id: string): Promise<IFile | null> {
//     return await this.fileRepository.delete(id);
//   }
}