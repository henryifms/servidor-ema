import Sequelize from "sequelize";
import config from "../config/database.cjs";

import Estacao from "../app/models/Estacao.js";
import Leitura from "../app/models/Leitura.js";

class Database {
  constructor() {
    this.connection = new Sequelize(config);
    this.models = {
      Estacao,
      Leitura,
    };
    this.initModels();
    this.runAssociations();
  }

  initModels() {
    Object.keys(this.models).forEach((modelName) => {
      const model = this.models[modelName];

      if (typeof model.init === "function") {
        model.init(this.connection);
      }
    });
  }

  runAssociations() {
    Object.keys(this.models).forEach((modelName) => {
      const model = this.models[modelName];

      if (typeof model.associate === "function") {
        model.associate(this.models);
      }
    });
  }
}

const database = new Database();

export default database;
