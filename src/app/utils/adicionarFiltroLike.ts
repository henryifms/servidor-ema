import { Op, WhereOptions } from "sequelize";

export default function adicionarFiltroLike(
  where: WhereOptions,
  campo: string,
  valor?: string
) {
  if (!valor) return;

  (where as any)[campo] = {
    [Op.iLike]: `%${valor}%`,
  };
}
