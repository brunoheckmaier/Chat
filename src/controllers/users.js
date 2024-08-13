import crypto from "crypto";
import { connection } from "../config/db.js";
import { ulid } from "ulid";
import jwt from "jsonwebtoken";
import { create } from "domain";

const userController = {
  async userRegistration(req, res) {
    const { email, pass } = req.body;

    if (!email || !pass) {
      console.log("Email ou senha não foram definidos");
      return res.status(400).send("Email ou senha não foram definidos");
    }

    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      console.log("Email inválido");
      return res.status(400).send("Email inválido");
    }

    try {
      const query = `SELECT email FROM users WHERE email = $1`;
      const result = await connection.query(query, [email]);

      if (result.rows.length > 0) {
        console.log("Email já registrado");
        return res.status(409).send("Email já registrado");
      }

      // Gerar hash da senha
      const hash = crypto
        .createHmac(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET)
        .update(Buffer.from(pass, "utf-8"))
        .digest("hex");

      const insertQuery = `
        INSERT INTO users (id, email, pass)
        VALUES ($1, $2, $3)
      `;
      const userId = ulid();
      await connection.query(insertQuery, [userId, email, hash]);

      console.log("Usuário registrado com sucesso");
      return res.status(201).send("Usuário registrado com sucesso");
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
      return res.status(500).send("Erro ao registrar usuário");
    }
  },

  async login(req, res) {
    const { email, pass } = req.body;

    if (!email || !pass) {
      console.log("Email ou senha não foram definidos");
      return res.status(400).send("Email ou senha não foram definidos");
    }

    try {
      // Gerar hash da senha
      const hash = crypto
        .createHmac(process.env.CRYPTO_ALGORITHM, process.env.CRYPTO_SECRET)
        .update(Buffer.from(pass, "utf-8"))
        .digest("hex");

      const query = "select * from users where email = $1 and pass = $2";
      const result = await connection.query(query, [email, hash]);

      if (result.rows.length === 0) {
        return res.status(401).send("Email ou senha incorretos");
      }

      const user = result.rows[0];

      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          status_acc: user.status_acc,
          create_at: user.created_at,
          update_at: user.update_at,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      return res.status(200).json({ token });
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      return res.status(500).send("Erro ao fazer login.");
    }
  },
};

export default userController;
