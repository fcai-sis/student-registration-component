import { Router } from "express";

import startRegistrationSessionRoutes from "./features/registrationSession/registrationSession.routes.js";

const router: Router = Router();

export default (): Router => {
  startRegistrationSessionRoutes(router);

  return router;
};
