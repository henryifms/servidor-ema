import "dotenv/config";
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
const config = {
    dialect: required("DB_DIALECT"),
    host: required("DB_HOST"),
    port: Number(required("DB_PORT")),
    username: required("DB_USER"),
    password: required("DB_PASSWORD"),
    database: required("DB_NAME"),
    define: {
        timestamps: true,
        underscored: true,
    },
};
export default config;
