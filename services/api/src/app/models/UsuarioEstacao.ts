import { Model, DataTypes } from "sequelize";

class UsuarioEstacao extends Model {
  static initModel(sequelize) {
    super.init(
      {
        usuario_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },

        estacao_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
        },

        papel: {
          type: DataTypes.STRING,
        },
      },
      {
        sequelize,
        tableName: "usuarios_estacoes",
        timestamps: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em",
      }
    );
  }
}

export default UsuarioEstacao;
