export default function adicionarFiltroStatus(
  where: any,
  status?: string,
  allowed?: readonly string[]
) {
  if (!status) return;

  const normalized = status.toUpperCase();

  if (allowed && !allowed.includes(normalized)) {
    throw new Error("Status inválido");
  }

  where.status = normalized;
}
