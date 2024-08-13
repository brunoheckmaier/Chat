import "dotenv/config";
import { migrate } from "postgres-migrations";
import { connect, connection } from "./config/db.js";
import express from "express";
import cors from "cors";
import route from "./routes.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use("/api", route);

const port = process.env.PORT || 3000;

const main = async () => {
  await connect();
  await migrate({ client: connection }, process.env.MIGRATION);

  app.listen(port, () => {
    console.log(`Servidor iniciado: http://localhost:${port}`);
  });
};

main();
