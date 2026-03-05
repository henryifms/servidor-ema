import "dotenv/config";
import express from "express";
import routes from "./routes/routes.js";
import "./database/index.js";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.server.use(express.json());
    this.server.use(express.urlencoded({ extended: false }));
  }
  routes() {
    this.server.use(routes);
  }
  exceptionHandler() {
    this.server.use((err, req, res, next) => {
      if (process.env.NODE_ENV === "development") {
        console.error(err);
      }

      return res.status(500).json({
        error: "Internal server error.",
      });
    });
  }
}

export default new App().server;
