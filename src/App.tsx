import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";

function App() {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Redirect de raíz */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Rutas protegidas (puedes envolverlas en un layout/auth guard más adelante) */}
      {/* <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quiz/create" element={<QuizCreator />} />
      <Route path="/quiz/:quizId" element={<QuizRunner />} /> */}

      {/* Cualquier otra ruta desconocida redirige */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
