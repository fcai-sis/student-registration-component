export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
  LOGS_PATH: process.env.LOGS_PATH,
  MONGO_URI: process.env.MONGO_URI,
};

export default env;

export const validateEnvironmentVariables = () => {
  Object.entries(env).forEach(([key, value]) => {
    if (!value) {
      // Warn the user that the environment variable is not set
      console.warn(`Environment variable ${key} is not set!`);
    }
  });
};
