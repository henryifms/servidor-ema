import { Sequelize, DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

interface AtributosUsuario {
  id?: number;
  nome: string;
  email: string;
  password?: string;
  password_hash: string;
}

class Usuario extends Model<AtributosUsuario> implements AtributosUsuario {
  declare id?: number;
  declare nome: string;
  declare email: string;
  declare password?: string;
  declare password_hash: string;

  static initModel(sequelize: Sequelize) {
    const model = super.init(
      {
        nome: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.VIRTUAL,
        password_hash: DataTypes.STRING,
      },
      {
        sequelize,
        tableName: "usuarios",
        modelName: "Usuario",
        underscored: true,
        createdAt: "criado_em",
        updatedAt: "atualizado_em",
      }
    );

    this.addHook("beforeSave", async (usuario: Usuario) => {
      if (usuario.password) {
        usuario.password_hash = await bcrypt.hash(usuario.password, 8);
      }
    });

    return model;
  }

  static associate(models: any) {
    this.belongsToMany(models.Estacao, {
      through: "usuarios_estacoes",
      foreignKey: "usuario_id",
      as: "estacoes",
    });
  }

  async checkPassword(password: string) {
    return bcrypt.compare(password, this.password_hash);
  }
}

export default Usuario;
