import { Router } from "express";
import greetingRoutes from "./features/greeting/greeting.routes.js";
import goodbyeRoutes from "./features/goodbye/goodbye.routes.js";

const router: Router = Router();

export default (): Router => {
    greetingRoutes(router);
    goodbyeRoutes(router);

    return router;
}