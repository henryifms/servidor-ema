import { Op, literal } from "sequelize";

export default function adicionarFiltroGeografico(where: any, query: any) {
  const { latitude, longitude, raio } = query;

  if (!latitude || !longitude || !raio) return;

  where[Op.and].push(
    literal(`
      ST_DWithin(
        localizacao,
        ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography,
        ${Number(raio)}
      )
    `)
  );
}
