export default function adicionarFiltroLike(
  where: WhereOptions,
  campo: string,
  valor?: string
) {
  if (!valor) return;

  Object.assign(where, {
    [campo]: { [Op.iLike]: `%${valor}%` },
  });
}
