import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { RequestHelper } from "../../utils/RequestHelper";
import Skeleton from "react-loading-skeleton";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import { HiPlay, HiArrowLeft, HiKey } from "react-icons/hi";
import { ToastHelper } from "../../utils/ToastHelper";

interface Quiz {
  id: number;
  title: string;
  description?: string;
}

const TakeQuizHome = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await RequestHelper.get<{ data: Quiz[] }>("Quiz/list");
        setQuizzes([...res.data]);
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [handleError]);

  const handleStart = () => {
    if (!code.trim()) {
      ToastHelper.warning("Please enter a quiz code");
      return;
    }
    navigate(`/quiz/take/code/${code}`);
  };

  const handlePickQuiz = (id: number) => {
    navigate(`/quiz/take/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6">
      <div className="w-full max-w-3xl mx-auto">
        <div className="flex items-center mb-8">
          <Button
            color="gray"
            onClick={() => navigate(-1)}
            className="cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <HiArrowLeft className="h-5 w-5" />
            Back
          </Button>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700 mb-8 hover:border-purple-500 transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <HiKey className="h-6 w-6 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold">Join a Quiz</h1>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="code" className="text-lg mb-2 block">
                Enter Quiz Code
              </Label>
              <TextInput
                id="code"
                placeholder="Enter quiz code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="bg-gray-700 border-gray-600 focus:border-purple-500"
              />
            </div>

            <Button
              onClick={handleStart}
              color="purple"
              className="w-full py-2 hover:scale-105 transition-transform duration-200"
              disabled={!code.trim()}
            >
              Start Quiz
            </Button>
          </div>
        </div>

        <div className="bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <HiPlay className="h-6 w-6 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">Available Quizzes</h2>
          </div>

          <div className="h-[52vh] overflow-y-auto p-2 space-y-4">
            {loading ? (
              <div className="grid gap-4">
                {[...Array(7)].map((_, index) => (
                  <div
                    key={index}
                    className="p-6 bg-gray-700 rounded-xl shadow-md border border-gray-600 animate-pulse"
                  >
                    <h2 className="text-xl font-semibold mb-2">
                      <Skeleton width="70%" height={24} />
                    </h2>
                    <p className="text-gray-400">
                      <Skeleton width="90%" height={16} className="mt-2" />
                    </p>
                  </div>
                ))}
              </div>
            ) : quizzes.length === 0 ? (
              <div className="text-center p-8 bg-gray-700/50 rounded-xl">
                <p className="text-gray-400 text-lg">No quizzes available</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-6 bg-gray-700 rounded-xl border border-gray-600 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">
                          {quiz.title}
                        </h3>
                        {quiz.description && (
                          <p className="text-gray-400 text-sm">
                            {quiz.description}
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        color="blue"
                        onClick={() => handlePickQuiz(quiz.id)}
                        className="flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform duration-200"
                      >
                        <HiPlay className="h-5 w-5" />
                        Take Quiz
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeQuizHome;
