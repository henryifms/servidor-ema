import { Model, DataTypes } from "sequelize";
import sequelize from "../../database";

class UsuarioEstacao extends Model {}

UsuarioEstacao.init(
  {
    usuario_id: DataTypes.INTEGER,
    estacao_id: DataTypes.INTEGER,
    papel: DataTypes.STRING,
    status: DataTypes.STRING,
  },
  {
    sequelize,
    tableName: "usuarios_estacoes",
  }
);

export default UsuarioEstacao;
