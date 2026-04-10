import { Op } from "sequelize";

export default function construirIntervaloData(antes?: Date, depois?: Date) {
  if (!antes && !depois) return null;

  const intervalo: any = {};

  if (antes instanceof Date && !isNaN(antes.getTime())) {
    intervalo[Op.lte] = antes;
  }

  if (depois instanceof Date && !isNaN(depois.getTime())) {
    intervalo[Op.gte] = depois;
  }

  return Object.keys(intervalo).length ||
    Object.getOwnPropertySymbols(intervalo).length
    ? intervalo
    : null;
}
