import { Router } from "express";

import uploadFileRoutes from "./features/addStudents/addStudents.routes.js";

const router: Router = Router();

export default (): Router => {
  uploadFileRoutes(router);

  return router;
};
