import { Router } from "express";

import addStudentsRoutes from "./features/addStudents/addStudents.routes.js";

const router: Router = Router();

export default (): Router => {
  addStudentsRoutes(router);

  return router;
};
