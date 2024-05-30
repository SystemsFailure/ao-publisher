import { Request, Response } from "express";

export const uploadFileController = (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
  
    const filePath: string = req.file.path;
    res.send({
      result: {},
      success: true,
    });
}