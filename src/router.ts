import { Router } from "express";
import studentsRoutes from "./features/students/students.routes";
import registrationSessionRoutes from "./features/registrationSession/registrationSession.routes";

export const studentsRouter = (): Router => {
  const router = Router();
  studentsRoutes(router);
  registrationSessionRoutes(router);
  return router;
};
