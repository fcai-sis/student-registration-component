import { Router } from "express";
import studentsRoutes from "features/students/students.routes";


export const studentsRouter = (): Router => {
  const router = Router();
  studentsRoutes(router);
  return router;
};
