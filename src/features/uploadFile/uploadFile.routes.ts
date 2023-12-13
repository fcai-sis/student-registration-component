import { Router } from "express";
import uploadFile from "../uploadFile/logic/upload.endpoint.js";
import multer from "multer";

const upload = multer({ dest: "./src/features/upload-file/uploads" });

export default (router: Router) => {
  router.post("/upload", upload.single("file"), uploadFile);
};
