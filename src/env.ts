export const env = {
    PORT: process.env.PORT,
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