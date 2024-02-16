import { Router } from "express";
import studentsRoutes from "./features/students/students.routes";
import registrationSessionRoutes from "./features/registrationSession/registrationSession.routes";

export const studentsRouter = (): Router => {
  const router = Router();
  studentsRoutes(router);
  return router;
};

export const sessionRouter = (): Router => {
  const router = Router();
  registrationSessionRoutes(router);
  return router;
}
