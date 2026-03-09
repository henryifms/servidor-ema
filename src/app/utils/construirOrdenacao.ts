import { Order } from "sequelize";

export default function construirOrdenacao(sort?: string): Order {
  if (!sort) return [];

  return sort.split(",").map((item) => {
    const [campo, direcao] = item.split(":");

    return [
      campo,
      direcao?.toUpperCase() === "DESC" ? "DESC" : "ASC",
    ];
  });
}
