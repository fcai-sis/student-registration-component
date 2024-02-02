import { Router } from "express";

import startRegistrationSessionRoutes from "./features/registrationSession/registrationSession.routes";
import studentsRoutes from "./features/students/students.routes";

const router: Router = Router();

export default (): Router => {
  startRegistrationSessionRoutes(router);
  studentsRoutes(router);

  return router;
};
