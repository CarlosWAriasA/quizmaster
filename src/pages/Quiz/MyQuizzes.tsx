import { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import { RequestHelper } from "../../utils/RequestHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";

interface Quiz {
  id: number;
  title: string;
  description?: string;
  dateCreated: string;
}

interface ListQuizResponse {
  data: Quiz[];
}

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await RequestHelper.get<ListQuizResponse>("Quiz/list");
        console.log(res);
        setQuizzes(res.data);
      } catch (error) {
        console.log(error);
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  });

  const handleCreateNewQuiz = () => {
    navigate("/quiz/create");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button
            color="gray"
            onClick={handleGoBack}
            className="cursor-pointer"
          >
            Back
          </Button>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <Button
            color="purple"
            onClick={handleCreateNewQuiz}
            className="cursor-pointer"
          >
            Create Quiz
          </Button>
        </div>

        <div className="h-[82vh] overflow-y-auto p-2 rounded-lg bg-gray-800 border border-gray-700">
          {loading ? (
            <div className="grid gap-6">
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
            <div className="text-center text-gray-400">No quizzes found.</div>
          ) : (
            <div className="grid gap-6">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-5 bg-gray-700 rounded-xl shadow-md border border-gray-600 hover:shadow-lg transition-shadow"
                >
                  <h2 className="text-xl font-bold text-white mb-2">
                    {quiz.title}
                  </h2>

                  {quiz.description && (
                    <p className="text-gray-300 mb-3">{quiz.description}</p>
                  )}

                  <p className="text-xs text-gray-400">
                    Created on:{" "}
                    {new Date(quiz.dateCreated).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyQuizzes;
