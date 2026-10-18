import { config } from "dotenv";
import jwt from "jsonwebtoken";
import db from "../models/index.cjs";

config();

const { User } = db;
const { JWT_SECRET } = process.env;

export const verifyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    if (!token) res.status(401).json("token not found");

    const decode = jwt.verify(token, JWT_SECRET);

    req.userId = decode.id;

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to verify user", error });
  }
};

export const verifyRole = async (req, res, next) => {
  try {
    const id = req.userId;
    if (!id) res.status(401).json("user role id not found");

    const user = await User.findByPk(id);

    if (user.role === "customer")
      res.status(400).json({ msg: "not authorized" });

    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "failed to verify user role", error });
  }
};
