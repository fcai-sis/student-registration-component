export const env = {
    PORT: process.env.PORT,
    FILE_UPLOAD_PATH: process.env.FILE_UPLOAD_PATH,
};

export default env;

export const validateEnvironmentVariables = () => {
    Object.entries(env).forEach(([key, value]) => {
        if (!value) {
            // Warn the user that the environment variable is not set
            console.warn(`Environment variable ${key} is not set!`);
        }
    });
}