import { Op } from "sequelize";

export default function adicionarFiltroGeografico(where: any, query: any) {
  const { lat, lng, raio } = query;

  if (!lat || !lng || !raio) return;

  where.localizacao = {
    [Op.near]: {
      center: [Number(lng), Number(lat)],
      radius: Number(raio),
    },
  };
}
