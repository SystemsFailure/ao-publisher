import { Request, Response } from "express";
import { GenericObject, transformArray } from "../helpers/transform.keys";
import { Publisher } from "../publisher.class";
import { publishAds } from "../strategy/ContextStrategy";


export const publishController = async (req: Request, res: Response) => {
    const avitoPoster: Publisher = new Publisher();
  
    avitoPoster.readExcel('./src/excel/1716544484326_Шаблон01.xlsx');
    const transformedArr: GenericObject[] = transformArray(avitoPoster.ads);
  
    publishAds(transformedArr)
  
    res.send('Ads have been posted successfully');
}