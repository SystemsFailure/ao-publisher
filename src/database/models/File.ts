import { Schema, model, Document } from 'mongoose';

export interface IFile extends Document {
  name: string;
  localPath: string;
  storagePath: string;
  size: number;
}

const FileSchema = new Schema<IFile>({
  name: { type: String, required: true },
  localPath: { type: String, required: true, unique: true },
  storagePath: { type: String, required: true, unique: true },
  size: { type: Number, required: false },
});

export const File = model<IFile>('File', FileSchema);