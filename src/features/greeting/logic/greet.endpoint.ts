import { Request, Response } from "express";
import GreetingModel from "../data/greeting.model.js";

export default (req: Request, res: Response) => {
    const greeting: GreetingModel = { greeting: 'Hello World!' };

    res.send(greeting);
}