import { Request, Response } from "express";
import GoodByeModel from "../data/goodbye.model.js";

export default (req: Request, res: Response) => {
    const goodbye: GoodByeModel = { goodbye: 'Goodbye World!' };

    res.send(goodbye);
}