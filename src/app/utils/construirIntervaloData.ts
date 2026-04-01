import { Op } from "sequelize";
import { parseISO, isValid } from "date-fns";

export default function construirIntervaloData(
  antes?: string,
  depois?: string
) {
  if (!antes && !depois) return null;

  const intervalo: any = {}; // Use any aqui ou Record<symbol, Date>

  if (antes) {
    const dataAntes = parseISO(antes);
    if (isValid(dataAntes)) intervalo[Op.lte] = dataAntes;
  }

  if (depois) {
    const dataDepois = parseISO(depois);
    if (isValid(dataDepois)) intervalo[Op.gte] = dataDepois;
  }

  return Object.keys(intervalo).length ||
    Object.getOwnPropertySymbols(intervalo).length
    ? intervalo
    : null;
}
