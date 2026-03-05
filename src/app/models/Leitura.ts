
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface AtributosLeitura {
  estacao_id: number;
  temperatura: number;
  umidade: number;
  pressao_atmosferica: number;
  velocidade_vento: number;
  precipitacao: number;
  data_leitura: Date;
}

interface CriacaoLeituraAtributos
 extends Optional<AtributosLeitura, "data_leitura"> {}

class Leitura 
  extends Model<AtributosLeitura, CriacaoLeituraAtributos>
  implements AtributosLeitura
{
  declare estacao_id: number;
  declare temperatura: number;
  declare umidade: number;
  declare pressao_atmosferica: number;
  declare velocidade_vento: number;
  declare precipitacao: number;
  declare data_leitura: Date;

  static initModel(sequelize: Sequelize) {
    return super.init(
      {
        estacao_id: DataTypes.INTEGER,
        temperatura: DataTypes.FLOAT,
        umidade: DataTypes.FLOAT,
        pressao_atmosferica: DataTypes.FLOAT,
        velocidade_vento: DataTypes.FLOAT,
        precipitacao: DataTypes.FLOAT,
        data_leitura: {
          type: DataTypes.DATE,
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
  }

  static associate(models: any) {
    this.belongsTo(models.Estacao, { foreignKey: "estacao_id", as: "estacao" })
  }
}

export default Leitura;
