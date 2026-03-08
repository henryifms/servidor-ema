export default {
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
            apiKey: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
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
    },
    async down(queryInterface) {
        await queryInterface.dropTable("estacoes_metereologicas");
    },
};
//# sourceMappingURL=20260303203320-create-estacoes-matereologicas.js.map