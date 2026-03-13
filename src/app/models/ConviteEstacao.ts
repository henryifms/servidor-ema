import { Model, DataTypes } from "sequelize";
import sequelize from "../../database";

class ConviteEstacao extends Model {}

ConviteEstacao.init(
  {
    usuario_id: DataTypes.INTEGER,
    estacao_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    token: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "convites_estacao",
  }
);

export default ConviteEstacao;
