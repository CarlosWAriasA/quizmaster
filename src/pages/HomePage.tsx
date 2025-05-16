import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import {
  HiPlus,
  HiCollection,
  HiAcademicCap,
  HiChartBar,
  HiLogout,
} from "react-icons/hi";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ToastHelper } from "../utils/ToastHelper";
import { useErrorHandler } from "../hooks/userErrorHandler";
const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const { handleError } = useErrorHandler();

  const handleLogout = async () => {
    try {
      logout();
      ToastHelper.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            Welcome to QuizMaster
          </h1>
          <p className="text-gray-400 text-lg">
            Your ultimate platform for creating and taking quizzes
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="group p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:border-purple-500 transition-all duration-300 hover:shadow-purple-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-500/10 rounded-xl">
                <HiPlus className="w-8 h-8 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">Create a New Quiz</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Start building a quiz with multiple questions and options. Design
              engaging quizzes for your audience.
            </p>
            <Button
              className="w-full cursor-pointer bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
              onClick={() => navigate("/quiz/edit")}
            >
              Create Quiz
            </Button>
          </div>

          <div className="group p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-blue-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-500/10 rounded-xl">
                <HiCollection className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold">View My Quizzes</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Browse and manage all your created quizzes. Edit, share, or delete
              them as needed.
            </p>
            <Button
              className="w-full cursor-pointer bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
              onClick={() => navigate("/quiz/list")}
            >
              View Quizzes
            </Button>
          </div>

          <div className="group p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:border-green-500 transition-all duration-300 hover:shadow-green-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-500/10 rounded-xl">
                <HiAcademicCap className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Take a Quiz</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Join a quiz by entering a quiz code or selecting one from the
              available quizzes.
            </p>
            <Button
              className="w-full cursor-pointer bg-green-500 hover:bg-green-600 transition-colors duration-200"
              onClick={() => navigate("/quiz/take")}
            >
              Take Quiz
            </Button>
          </div>

          <div className="group p-8 bg-gray-800 rounded-2xl shadow-lg border border-gray-700 hover:border-yellow-500 transition-all duration-300 hover:shadow-yellow-500/20">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-yellow-500/10 rounded-xl">
                <HiChartBar className="w-8 h-8 text-yellow-400" />
              </div>
              <h2 className="text-2xl font-bold">Results</h2>
            </div>
            <p className="text-gray-400 mb-6">
              Track your performance and view detailed scores from your past
              quiz attempts.
            </p>
            <Button
              className="w-full cursor-pointer bg-yellow-500 hover:bg-yellow-600 transition-colors duration-200"
              onClick={() => navigate("/quiz/results")}
            >
              View Results
            </Button>
          </div>

          <div className="fixed bottom-8 right-8">
            <Button
              color="failure"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-2 hover:scale-105 transition-transform duration-200 bg-red-500 hover:bg-red-600 shadow-lg"
            >
              <HiLogout className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
