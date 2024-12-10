import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { username, email, password, telephone } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      telephone,
    });
    const userSaved = await newUser.save();
    const token = await createAccessToken({ id: userSaved._id });
    res.cookie("token", token);
    res.json({ message: "Usuario creado correctamente" });
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Credenciales invalidas" });

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", { expires: new Date(0) });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);
  if (!userFound)
    return res.status(400).json({ message: "Usuario no encontrado" });
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
  });
};

export async function updatePassword(req, res) {
  const { oldPassword, newPasword } = req.body;

  if ((!oldPassword, newPasword)) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    const user = await User.findById(req.user.id);
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Contraseña actual incorrecta" });
    }

    user.password = await bcrypt.hash(newPasword, 10);
    await user.save();

    res.status(200).json({ mesage: "Contraseña actualizada exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar la contraseña" });
  }
}

export async function resetPassword(req, res) {
  const { email, newPasword, token } = req.body;
  if (!email || !newPasword || !token) {
    return res
      .status(400)
      .json({ error: "Email, nueva contraseña y token son obligatorios" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email, _id: decoded.id });

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    user.password = await bcrypt.hash(newPasword, 10);
    await user.save();
    res.status(200).json({ message: "Contraseña restablecida exitosamente" });
  } catch (err) {
    res.status(500).json({ error: "Error al restablecer la contraseña" });
  }
}
