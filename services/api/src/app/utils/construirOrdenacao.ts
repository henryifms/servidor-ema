import { Order } from "sequelize";

export default function construirOrdenacao(sort?: string): Order {
  if (!sort) return [];

  return sort.split(",").map((item) => {
    const [campo, direcao] = item.split(":");

    if (!campo) {
      throw new Error("Campo de ordenação inválido");
    }

    const dir = direcao?.toUpperCase();

    if (dir !== "ASC" && dir !== "DESC") {
      throw new Error(`Direção inválida para '${campo}': ${direcao}`);
    }

    return [campo, dir];
  });
}
