import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";
class Usuario extends Model {
    static initModel(sequelize) {
        const model = super.init({
            nome: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.VIRTUAL,
            password_hash: DataTypes.STRING,
        }, {
            sequelize,
            tableName: "usuarios",
            modelName: "Usuario",
            underscored: true,
        });
        this.addHook("beforeSave", async (usuario) => {
            if (usuario.password) {
                usuario.password_hash = await bcrypt.hash(usuario.password, 8);
            }
        });
        return model;
    }
    static associate(models) {
        this.belongsToMany(models.Estacao, {
            through: "usuarios_estacoes",
            foreignKey: "usuario_id",
            as: "estacoes",
        });
    }
    async checkPassword(password) {
        return bcrypt.compare(password, this.password_hash);
    }
}
export default Usuario;
