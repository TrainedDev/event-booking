import { loginService, registerService } from "../services/user.services.js";
import { appError } from "../utils/app.utils.js";
import { responseHandler } from "../utils/handler.utils.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) appError("Email and password are required.");

  const response = await loginService(email, password);

  responseHandler(res, 200, response);
};

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password)
    appError("Username, email and password are required.");

  const response = await registerService(username, email, password, role);

  responseHandler(res, 201, response);
};
