import { Schema, model, Document } from 'mongoose';

export interface IFile extends Document {
  name: string;
  filePath: string;
  storagePath: string;
  size: number;
  lastModify: string;
}

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  filePath: { type: String, required: true, unique: true },
  storagePath: { type: String, required: true, unique: true },
  size: { type: Number, required: false },
  lastModify: { type: String, required: false },
});

export const File = model<IFile>('File', FileSchema);