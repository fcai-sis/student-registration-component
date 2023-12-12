import { Router } from "express";
import uploadFile from "../upload-file/logic/upload.js";
import multer from "multer";
const upload = multer({ dest: "./src/features/upload-file/uploads" });
export default (router: Router) => {
  router.post("/upload", upload.single("file"), uploadFile);
};
