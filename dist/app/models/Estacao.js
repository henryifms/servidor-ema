import { DataTypes, Model } from "sequelize";
class Estacao extends Model {
    static initModel(sequelize) {
        return super.init({
            nome: DataTypes.STRING,
            localizacao: DataTypes.GEOGRAPHY("POINT", 4326),
            api_key: DataTypes.STRING,
        }, {
            sequelize,
            tableName: "estacoes_metereologicas",
            modelName: "Estacao",
            underscored: true,
            createdAt: "criado_em",
            updatedAt: "atualizado_em",
        });
    }
    static associate(models) {
        this.hasMany(models.Leitura, { foreignKey: "estacao_id", as: "leituras" });
        this.belongsToMany(models.Usuario, {
            through: "usuarios_estacoes",
            foreignKey: "estacao_id",
            as: "usuarios",
        });
    }
}
export default Estacao;
//# sourceMappingURL=Estacao.js.map