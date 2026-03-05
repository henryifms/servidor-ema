import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface Localizacao {
  type: "Point";
  coordinates: number[];
}

interface AtributosEstacao {
  id?: number;
  nome: string;
  localizacao: Localizacao;
  api_key: string;
}

interface CriacaoEstacaoAtributos
  extends Optional<AtributosEstacao, "api_key" | "id"> {}

class Estacao
  extends Model<AtributosEstacao, CriacaoEstacaoAtributos>
  implements AtributosEstacao
{
  declare id?: number;
  declare nome: string;
  declare localizacao: Localizacao;
  declare api_key: string;

  static initModel(sequelize: Sequelize) {
    return super.init(
      {
        nome: DataTypes.STRING,
        localizacao: DataTypes.GEOGRAPHY("POINT", 4326),
        api_key: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "estacoes_metereologicas",
        modelName: "Estacao",
        underscored: true,
      }
    );
  }

  static associate(models: any) {
    this.hasMany(models.Leitura, { foreignKey: "estacao_id", as: "leituras" });
    this.belongsToMany(models.Usuario, {
      through: "usuarios_estacoes",
      foreignKey: "estacao_id",
      as: "usuarios",
    });
  }
}

export default Estacao;
