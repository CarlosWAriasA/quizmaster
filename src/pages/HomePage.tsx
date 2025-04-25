import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Welcome to QuizMaster
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Create a New Quiz</h2>
            <p className="text-gray-400 mb-4">
              Start building a quiz with multiple questions and options.
            </p>
            <Button
              color="purple"
              className="cursor-pointer"
              onClick={() => navigate("/quiz/create")}
            >
              Create Quiz
            </Button>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">View My Quizzes</h2>
            <p className="text-gray-400 mb-4">
              Browse quizzes you've created or taken in the past.
            </p>
            <Button onClick={() => navigate("/my-quizzes")}>
              View Quizzes
            </Button>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Take a Quiz</h2>
            <p className="text-gray-400 mb-4">
              Join a quiz by entering a quiz code or selecting one available.
            </p>
            <Button onClick={() => navigate("/take-quiz")}>Take Quiz</Button>
          </div>

          <div className="p-6 bg-gray-800 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <p className="text-gray-400 mb-4">
              View your performance and scores on past quizzes.
            </p>
            <Button onClick={() => navigate("/results")}>View Results</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
