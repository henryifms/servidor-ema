import Leitura from "../models/Leitura.ts";

class SaveLeituraJob {
  get key() {
    return "SaveLeitura";
  }

  async handle({ data }: any) {
    await Leitura.create(data);
  }
}

export default new SaveLeituraJob();
