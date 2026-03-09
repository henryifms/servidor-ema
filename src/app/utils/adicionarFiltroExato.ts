import { Op, WhereOptions } from "sequelize";

export default function adicionarFiltroExato(
  where: WhereOptions,
  campo: string,
  valor?: string
) {
  if (!valor) return;

  const numero = Number(valor);

  if (!Number.isNaN(numero)) {
    (where as Record<string, any>)[campo] = {
      [Op.eq]: numero,
    };
  }
}
