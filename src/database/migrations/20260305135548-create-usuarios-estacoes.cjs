"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("usuarios_estacoes", {
      usuario_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "usuarios",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      estacao_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: "estacoes_metereologicas",
          key: "id",
        },
        onDelete: "CASCADE",
      },

      papel: {
        type: Sequelize.ENUM("PROPRIETARIO", "ADMIN", "MEMBRO"),
        allowNull: false,
        defaultValue: "MEMBRO",
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
    await queryInterface.dropTable("usuarios_estacoes");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_usuarios_estacoes_role";'
    );
  },
};
