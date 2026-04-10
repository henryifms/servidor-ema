import Estacao from "../models/Estacao";

type Coordenada = {
  latitude: number;
  longitude: number;
};

// Fórmula de Haversine
function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // raio da Terra em km

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.asin(Math.sqrt(a));

  return R * c;
}

// Função principal
export default async function calcularDistancia(localizacao: Coordenada) {
  const estacoes = await Estacao.findAll();

  let menorDistancia = Infinity;
  let estacaoMaisProxima: any = null;

  for (const estacao of estacoes) {
    const [lng, lat] = estacao.localizacao.coordinates;

    const distancia = haversine(
      localizacao.latitude,
      localizacao.longitude,
      lat,
      lng
    );

    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      estacaoMaisProxima = estacao;
    }
  }

  return estacaoMaisProxima;
}
