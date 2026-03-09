"use strict";

const bcrypt = require("bcryptjs");

module.exports = {
  async up(queryInterface) {
    const email = process.env.ADMIN_EMAIL;
    const senha = process.env.ADMIN_PASSWORD;

    const [usuarios] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = :email",
      { replacements: { email } }
    );

    if (!usuarios.length) {
      await queryInterface.bulkInsert("usuarios", [
        {
          nome: "Admin",
          email,
          password_hash: await bcrypt.hash(senha, 8),
          criado_em: new Date(),
          atualizado_em: new Date(),
        },
      ]);
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete("usuarios", {
      email: "admin@email.com",
    });
  },
};
