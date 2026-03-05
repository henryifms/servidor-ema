import { QueryInterface, Sequelize } from "sequelize";

export default {
  async up(queryInterface: QueryInterface, Sequelize: typeof import("sequelize")) {
    await queryInterface.createTable("leituras_metereologicas", {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
      },

      estacao_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "estacoes_metereologicas",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },

      temperatura: {
        type: Sequelize.FLOAT,
      },

      umidade: {
        type: Sequelize.FLOAT,
      },

      pressao_atmosferica: {
        type: Sequelize.FLOAT,
      },

      velocidade_vento: {
        type: Sequelize.FLOAT,
      },

      precipitacao: {
        type: Sequelize.FLOAT,
      },

      data_leitura: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addIndex("leituras_metereologicas", [
      "estacao_id",
      "data_leitura",
    ]);
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable("leituras_metereologicas");
  },
};
