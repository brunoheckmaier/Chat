//Nao usado

import { connection } from "../config/db.js";

export const checkEmailExist = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return false;
  }

  try {
    const query = `SELECT email FROM users WHERE email = $1`;
    const result = await connection.query(query, [email]);
    console.log(result.rows);
  } catch (error) {
    console.log("Erro ao validar email. Erro: ", error);
    return error;
  }
};
