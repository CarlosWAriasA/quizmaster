import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { RequestHelper } from "../../utils/RequestHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import Skeleton from "react-loading-skeleton";
import { HiArrowLeft } from "react-icons/hi";
interface Quiz {
  id: number;
  title: string;
  description: string;
  code: string;
  userId: number;
  dateCreated: string;
  lastUpdate: string;
}

interface QuizResult {
  id: number;
  quizId: number;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  startTime: string;
  endTime: string;
  durationSeconds: number;
  quiz: Quiz;
}

const QuizResultsList = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchResults = useCallback(async () => {
    try {
      const res = await RequestHelper.get<{ data: QuizResult[] }>(
        "Quiz/results"
      );
      setResults(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

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
            className="cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform duration-200"
          >
            <HiArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-center flex-1">
            My Quiz Results
          </h1>
          <div className="w-16" />
        </div>

        <div className="h-[75vh] overflow-y-auto p-2 rounded-lg bg-gray-800 border border-gray-700">
          {loading ? (
            <div className="grid gap-6">
              {[...Array(5)].map((_, index) => (
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
          ) : results.length === 0 ? (
            <div className="text-center text-gray-400">
              No quiz results found.
            </div>
          ) : (
            <div className="grid gap-4">
              {results.map((result) => (
                <div
                  key={result.id}
                  className="p-6 bg-gray-700 rounded-xl shadow-md border border-gray-600 hover:shadow-lg transition-all duration-300 hover:bg-gray-650"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <h2 className="text-2xl font-bold text-white">
                        {result.quiz?.title || result.quizTitle}
                      </h2>
                      <span className="px-3 py-1 bg-gray-600 rounded-full text-sm font-medium text-gray-300">
                        Code: {result.quiz?.code || "N/A"}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm">
                      {result.quiz?.description || "No description"}
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="w-full bg-gray-600 rounded-full h-2.5">
                          <div
                            className="h-2.5 rounded-full bg-blue-500"
                            style={{ width: `${result.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-white">
                          {result.percentage}%
                        </span>
                        <span className="text-sm text-gray-400 ml-2">
                          ({result.score}/{result.totalQuestions})
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-600 pt-3">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>Duration: {result.durationSeconds}s</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>
                          Completed: {new Date(result.endTime).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizResultsList;
