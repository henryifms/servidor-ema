"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios_estacoes", {
      usuario_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "usuarios",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      estacao_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "estacoes_metereologicas",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

    await queryInterface.addConstraint("usuarios_estacoes", {
      fields: ["usuario_id", "estacao_id"],
      type: "primary key",
      name: "pk_usuario_estacao",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("usuarios_estacoes");
  },
};
