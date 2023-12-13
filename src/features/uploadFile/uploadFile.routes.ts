import { Router } from "express";
import uploadFile from "../uploadFile/logic/upload.endpoint.js";
import multer from "multer";
import env from "env.js";

const upload = multer({ dest: env.FILE_UPLOAD_PATH});

export default (router: Router) => {
  router.post("/upload", upload.single("file"), uploadFile);
};
