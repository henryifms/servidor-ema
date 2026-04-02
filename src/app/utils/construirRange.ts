import { Op } from "sequelize";

export default function buildRange(min?: string, max?: string) {
  if (!min && !max) return undefined;

  const range: any = {};

  if (min) range[Op.gte] = Number(min);
  if (max) range[Op.lte] = Number(max);

  return Object.keys(range).length || Object.getOwnPropertySymbols(range).length
    ? range
    : undefined;
}
