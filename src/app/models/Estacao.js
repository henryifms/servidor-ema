import Sequelize, { Model } from "sequelize";

class Estacao extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        localizacao: Sequelize.GEOGRAPHY("POINT", 4326),
      },
      {
        sequelize,
        tableName: "estacoes_metereologicas",
        modelName: "Estacao",
        underscored: true,
      }
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Leitura, { foreignKey: "estacao_id", as: "leituras" });
  }
}

export default Estacao;
