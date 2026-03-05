import { Request, Response } from "express";

class LeiturasController {
  index(req: Request, res: Response) {
    res.json({ message: "ok!" });
  }
}

export default new LeiturasController();
