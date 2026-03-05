import "dotenv/config";
import { Options } from "sequelize";

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }

  return value;
}

const config: Options = {
  dialect: required("DB_DIALECT") as any,
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
