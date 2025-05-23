import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import PrivateRoute from "./components/PrivateRoute";
import PrivateLayout from "./components/PrivateLayout";
import HomePage from "./pages/HomePage";
import PublicRoute from "./components/PublicRoute";
import LoadingSpinner from "./components/LoadingSpinner";
import QuizEdit from "./pages/Quiz/QuizEdit";
import MyQuizzes from "./pages/Quiz/MyQuizzes";
import TakeQuizHome from "./pages/Quiz/TakeQuizHome";
import TakeQuiz from "./pages/Quiz/TakeQuiz";
import QuizResultsList from "./pages/Quiz/QuizResultList";

function App() {
  const { isAuthenticated, loadingSession } = useContext(AuthContext);

  if (loadingSession) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <LoadingSpinner width={80} height={80} />
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      <Route
        path="/home"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <HomePage />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz/edit"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <QuizEdit />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz/list"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <MyQuizzes />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz/take"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <TakeQuizHome />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz/take/:id"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <TakeQuiz />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz/take/code/:code"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <TakeQuiz />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="/quiz/results"
        element={
          <PrivateRoute>
            <PrivateLayout>
              <QuizResultsList />
            </PrivateLayout>
          </PrivateRoute>
        }
      />

      <Route
        path="*"
        element={<div className="text-black text-center">404 - Not Found</div>}
      />
    </Routes>
  );
}

export default App;
