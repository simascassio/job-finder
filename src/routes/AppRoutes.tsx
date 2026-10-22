import { Navigate, Route, Routes } from "react-router";
import { ProtectedRoute } from "../components/ProtectedRoute/ProtectedRoute";
import { Cadastro } from "../pages/Cadastro/Cadastro";
import { Home } from "../pages/Home/Home";
import { Login } from "../pages/Login/Login";
import { RecuperarSenha } from "../pages/RecuperarSenha/RecuperarSenha";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/recuperar-senha" element={<RecuperarSenha />} />
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
