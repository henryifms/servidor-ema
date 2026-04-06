import { Model, DataTypes, Sequelize } from "sequelize";

class ConviteEstacao extends Model {
  static initModel(sequelize: Sequelize) {
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
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em",
      }
    );

    return ConviteEstacao;
  }
}

export default ConviteEstacao;
