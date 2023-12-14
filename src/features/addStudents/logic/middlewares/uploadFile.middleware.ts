import multer from "multer";

import env from "../../../../env.js";

const fileFieldName = "file";

/**
 * Uploads a single file to the `FILE_UPLOAD_PATH` directory specified in the environment variables.
 */
export default multer({ dest: env.FILE_UPLOAD_PATH }).single(fileFieldName);
