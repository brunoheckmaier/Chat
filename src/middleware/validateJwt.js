import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Nao autorizado" });
  }

  const token = authorization.split(" ")[1];

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: user.id,
      email: user.email,
      status_acc: user.status_acc,
      create_at: user.created_at,
      update_at: user.update_at,
    };

    next();
  } catch (error) {
    return res.status(401).json({ mensagem: error.message });
  }
};
