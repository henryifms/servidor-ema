import { Op, WhereOptions } from "sequelize";

export default function adicionarFiltroExato(
  where: WhereOptions,
  campo: string,
  valor?: string
) {
  if (!valor) return;

  const numero = Number(valor);

  if (!Number.isNaN(numero)) {
    // Usar (where as any) é o jeito mais rápido,
    // mas para ser correto:
    Object.assign(where, {
      [campo]: { [Op.eq]: numero },
    });
  }
}
