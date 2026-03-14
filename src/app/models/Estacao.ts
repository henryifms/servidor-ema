import { Sequelize, DataTypes, Model, Optional, BelongsToManyHasAssociationMixin } from "sequelize";
import Usuario from "./Usuario.js";

interface Localizacao {
  type: "Point";
  coordinates: number[];
}

interface AtributosEstacao {
  id?: number;
  nome: string;
  localizacao: Localizacao;
  api_key: string;
  usuario_proprietario_id: number;
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
  declare addEquipe: BelongsToManyHasAssociationMixin<Usuario, number>;
  declare usuario_proprietario_id: number;
  declare proprietario?: Usuario;

  static initModel(sequelize: Sequelize) {
    return super.init(
      {
        nome: DataTypes.STRING,
        localizacao: DataTypes.GEOGRAPHY("POINT", 4326),
        api_key: DataTypes.STRING,
        usuario_proprietario_id: DataTypes.INTEGER,
      },
      {
        sequelize,
        tableName: "estacoes_metereologicas",
        modelName: "Estacao",
        underscored: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em",
      }
    );
  }

  static associate(models: any) {
    this.hasMany(models.Leitura, { foreignKey: "estacao_id", as: "leituras" });
    this.belongsToMany(models.Usuario, {
      through: "usuarios_estacoes",
      foreignKey: "estacao_id",
      as: "equipe",
    });

    this.belongsTo(models.Usuario, {
      foreignKey: "usuario_proprietario_id",
      as: "proprietario",
    });
  }
}

export default Estacao;
