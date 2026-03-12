"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("convites_estacao", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

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

      status: {
        type: Sequelize.ENUM("PENDENTE", "ACEITO", "REJEITADO"),
        allowNull: false,
        defaultValue: "PENDENTE",
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

    // impedir dois convites pendentes iguais
    await queryInterface.addConstraint("convites_estacao", {
      fields: ["usuario_id", "estacao_id"],
      type: "unique",
      name: "unique_convite_usuario_estacao",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("convites_estacao");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_convites_estacao_status";'
    );
  },
};
