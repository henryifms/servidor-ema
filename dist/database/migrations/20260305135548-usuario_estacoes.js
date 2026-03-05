import { DataTypes } from "sequelize";
export default {
    async up(queryInterface) {
        await queryInterface.createTable("usuario_estacoes", {
            usuarioId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "usuarios",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            estacaoId: {
                type: DataTypes.UUID,
                allowNull: false,
                references: {
                    model: "estacoes",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        });
        await queryInterface.addConstraint("usuario_estacoes", {
            fields: ["usuarioId", "estacaoId"],
            type: "primary key",
            name: "pk_usuario_estacao",
        });
    },
    async down(queryInterface) {
        await queryInterface.dropTable("usuario_estacoes");
    },
};
