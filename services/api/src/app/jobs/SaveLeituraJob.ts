import Leitura from "../models/Leitura.js";

interface LeituraData {
  // Defina os campos esperados para a leitura, ex:
  estacaoId: number;
  valor: number;
  timestamp?: Date;
  // outros campos...
}

class SaveLeituraJob {
  get key(): string {
    return "SaveLeitura";
  }

  async handle({ data }: { data: LeituraData }): Promise<void> {
    await Leitura.create(data);
  }
}

export default new SaveLeituraJob();
