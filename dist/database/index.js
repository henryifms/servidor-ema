import { Sequelize } from "sequelize";
import config from "../config/database.js";
import Estacao from "../app/models/Estacao.js";
import Leitura from "../app/models/Leitura.js";
import Usuario from "../app/models/Usuario.js";
class Database {
    connection;
    models;
    constructor() {
        this.connection = new Sequelize(config);
        this.models = {
            Estacao,
            Leitura,
            Usuario,
        };
        this.initModels();
        this.runAssociations();
    }
    initModels() {
        Object.keys(this.models).forEach((modelName) => {
            const model = this.models[modelName];
            if (typeof model.initModel === "function") {
                model.initModel(this.connection);
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
//# sourceMappingURL=index.js.map