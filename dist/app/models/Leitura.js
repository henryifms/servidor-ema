import { DataTypes, Model } from "sequelize";
class Leitura extends Model {
    static initModel(sequelize) {
        return super.init({
            estacao_id: DataTypes.INTEGER,
            temperatura: DataTypes.FLOAT,
            umidade: DataTypes.FLOAT,
            pressao_atmosferica: DataTypes.FLOAT,
            velocidade_vento: DataTypes.FLOAT,
            precipitacao: DataTypes.FLOAT,
            data_leitura: {
                type: DataTypes.DATE,
                allowNull: false,
            },
        }, {
            sequelize,
            tableName: "leituras_metereologicas",
            modelName: "Leitura",
            timestamps: false,
        });
    }
    static associate(models) {
        this.belongsTo(models.Estacao, { foreignKey: "estacao_id", as: "estacao" });
    }
}
export default Leitura;
