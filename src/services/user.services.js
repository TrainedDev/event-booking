import { config } from "dotenv";
import db from "../models/index.cjs";
import { appError } from "../utils/app.utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

config();

const { JWT_SECRET } = process.env;
const { User } = db;

export const loginService = async (email, password) => {
  const user = await User.unscoped()
    .scope({
      method: ["findUser", `${email}`],
    })
    .findOne();

  if (!user) appError("invalid credentials");

  const verifyPassword = await bcrypt.compare(password, user.password);

  if (!verifyPassword) appError("invalid credentials");

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" });

  return { msg: "successfully logged in ", data: token };
};

export const registerService = async (username, email, password, role) => {
  const user = await User.unscoped()
    .scope({
      method: ["findUser", email],
    })
    .findOne();

  if (user) appError("user already exist with this email");

  const newUser = await User.create({ username, email, password, role });

  const token = jwt.sign({ id: newUser.id }, JWT_SECRET, { expiresIn: "1h" });

  return { msg: "successfully registered in ", data: token };
};
