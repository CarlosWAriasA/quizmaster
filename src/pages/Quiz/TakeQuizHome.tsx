import { useEffect, useState } from "react";
import { Button, Label, TextInput } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { RequestHelper } from "../../utils/RequestHelper";
import Skeleton from "react-loading-skeleton";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import { HiPlay } from "react-icons/hi";
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
    <div className="min-h-screen flex flex-col items-center bg-gray-900 text-white p-6">
      <div className="w-full max-w-2xl">
        <div className="flex justify-start mb-4">
          <Button
            color="gray"
            onClick={() => navigate(-1)}
            className="cursor-pointer"
          >
            Back
          </Button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md mb-8">
          <h1 className="text-2xl font-bold mb-4 text-center">Join a Quiz</h1>
          <Label htmlFor="code" className="mb-2">
            Enter Quiz Code
          </Label>
          <TextInput
            id="code"
            placeholder="Enter quiz code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mb-4"
          />

          <Button
            onClick={handleStart}
            color="purple"
            className="w-full"
            disabled={!code.trim()}
          >
            Start Quiz
          </Button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md ">
          <h2 className="text-xl font-semibold mb-4">Or pick a quiz</h2>
          <div className="h-[52vh] overflow-y-auto p-2">
            {loading ? (
              <div className="grid gap-4">
                {[...Array(7)].map((_, index) => (
                  <div
                    key={index}
                    className="p-5 bg-gray-700 rounded-xl shadow-md border border-gray-600 animate-pulse"
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
              <div className="text-gray-400 text-center">
                No quizzes available
              </div>
            ) : (
              <div className="grid gap-4">
                {quizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-4 bg-gray-700 rounded-lg transition hover:bg-gray-600"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        {quiz.description && (
                          <p className="text-sm text-gray-400">
                            {quiz.description}
                          </p>
                        )}
                      </div>

                      <Button
                        size="xs"
                        color="purple"
                        onClick={() => handlePickQuiz(quiz.id)}
                        className="mt-4 sm:mt-0 flex items-center gap-2 cursor-pointer"
                      >
                        <HiPlay className="h-4 w-4" />
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
