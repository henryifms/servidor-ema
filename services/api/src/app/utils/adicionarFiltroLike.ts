import { Op } from "sequelize";

export default function adicionarFiltroLike(
  and: any[],
  campo: string,
  valor?: string
) {
  if (!valor) return;

  and.push({
    [campo]: {
      [Op.iLike]: `%${valor}%`,
    },
  });
}
