import "dotenv/config";
import { SignOptions } from "jsonwebtoken";

interface AuthConfig {
  secret: string;
  expiresIn: SignOptions["expiresIn"];
}

const auth: AuthConfig = {
  secret: process.env.APP_SECRET as string,
  expiresIn: "7d",
};

export default auth;
