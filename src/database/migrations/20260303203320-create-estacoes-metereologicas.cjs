"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("estacoes_metereologicas", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      localizacao: {
        type: Sequelize.GEOGRAPHY("POINT", 4326),
        allowNull: false,
      },

      api_key: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      criado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      atualizado_em: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("estacoes_metereologicas");
  },
};
