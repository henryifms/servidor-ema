import { Op } from "sequelize";
import { parseISO } from "date-fns";

export default function construirIntervaloData(
  antes?: string,
  depois?: string
) {
  if (!antes && !depois) return null;

  const intervalo: Record<symbol, Date> = {};

  if (antes) intervalo[Op.lte] = parseISO(antes);
  if (depois) intervalo[Op.gte] = parseISO(depois);

  return intervalo;
}
