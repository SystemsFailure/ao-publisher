import { Request, Response } from "express";
import { GenericObject, transformArray } from "../helpers/transform.keys";
import { publishAds } from "../strategy/ContextStrategy";

export const uploadJsonController = (req: Request, res: Response) => {
    const jsonObjectString = req.body.jsonObject;
    let listAds;
    try {
      listAds = JSON.parse(jsonObjectString);
    } catch (error) {
      return res.status(400).json({ error: 'Invalid JSON format' });
    }
  
    const transformedArr: GenericObject[] = transformArray(listAds);
    publishAds(transformedArr)
  
    console.log('Данные : ', listAds);
  
    res.json({ message: 'JSON received successfully', data: "dwijaroierteryjk" });
}