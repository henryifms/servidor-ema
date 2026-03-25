export async function geocodeEndereco(endereco: string) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json`,
    {
      headers: {
        "User-Agent": "projeto-ema",
      },
    }
  );

  const data = await res.json();

  if (!data.length) throw new Error("Endereço não encontrado");

  console.log("RAW ", data[0]);
  console.log("PARSED", {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  });

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

export async function reverseGeocode(lat: number, lng: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
    {
      headers: {
        "User-Agent": "projeto-ema",
      },
    }
  );

  const data = await res.json();

  return data.display_name;
}

function distancia(a: any, b: any) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy);
}

export async function processarLocalizacao({ endereco, coordinates }: any) {
  if (endereco && coordinates) {
    const geo = await geocodeEndereco(endereco);

    const dist = distancia(
      { lat: geo.lat, lng: geo.lng },
      { lat: coordinates[1], lng: coordinates[0] }
    );

    if (dist > 0.01) {
      throw new Error("Endereço e coordenadas não coincidem");
    }

    console.log("GEO RESULT:", geo);
    return {
      endereco,
      coordinates,
    };
  }

  if (endereco) {
    const geo = await geocodeEndereco(endereco);
    console.log("GEO RESULT:", geo);

    return {
      endereco,
      coordinates: [geo.lng, geo.lat],
    };
  }

  if (coordinates) {
    const endereco = await reverseGeocode(coordinates[1], coordinates[0]);

    return {
      endereco,
      coordinates,
    };
  }

  throw new Error("É necessário endereço ou localização");
}
