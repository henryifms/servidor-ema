import Sequelize, { Model } from "sequelize";

class Leitura extends Model {
  static init(sequelize) {
    super.init(
      {
        estacao_id: Sequelize.INTEGER,
        temperatura: Sequelize.FLOAT,
        umidade: Sequelize.FLOAT,
        pressao_atmosferica: Sequelize.FLOAT,
        velocidade_vento: Sequelize.FLOAT,
        precipitacao: Sequelize.FLOAT,
        data_leitura: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: "leituras_metereologicas",
        modelName: "Leitura",
        timestamps: false,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Estacao, { foreignKey: "estacao_id", as: "estacao" })
  }
}

export default Leitura;
