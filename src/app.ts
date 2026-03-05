import "dotenv/config";
import express, { Express, Request, Response, NextFunction } from "express";
import routes from "./routes/routes.js";
import "./database/index.ts";

class App {
  public server: Express

  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.exceptionHandler();
  }
  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
  }
  routes() {
    this.server.use(routes);
  }
  exceptionHandler() {
    this.server.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }

      return res.status(500).json({
        erro: "Erro interno do servidor.",
      });
    });
  }
}

export default new App().server;
