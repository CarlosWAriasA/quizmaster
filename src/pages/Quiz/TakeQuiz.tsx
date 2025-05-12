import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { RequestHelper } from "../../utils/RequestHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import LoadingSpinner from "../../components/LoadingSpinner";

interface QuizQuestion {
  id: number;
  title: string;
  options: {
    id: number;
    title: string;
    isCorrect: boolean;
  }[];
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

const TakeQuiz = () => {
  const { id, code } = useParams();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(new Date());
  const [answers, setAnswers] = useState<
    { questionId: number; selectedOptionId: number }[]
  >([]);

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        let res;

        if (id) {
          res = await RequestHelper.get<{ data: Quiz }>(`Quiz/${id}`);
        } else if (code) {
          res = await RequestHelper.get<{ data: Quiz }>(`Quiz/by-code/${code}`);
        }

        if (res?.data) {
          setQuiz(res.data);
        } else {
          throw new Error("Quiz not found");
        }
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    };

    if (id || code) fetchQuiz();
  }, [id, code, handleError]);

  const handleNext = async () => {
    if (!quiz) return;

    const question = quiz.questions[currentQuestion];

    if (selectedOption !== null) {
      setAnswers((prev) => [
        ...prev,
        { questionId: question.id, selectedOptionId: selectedOption },
      ]);
    }

    const isLast = currentQuestion === quiz.questions.length - 1;

    if (isLast) {
      const endTime = new Date();
      const totalQuestions = quiz.questions.length;

      let correct = 0;
      for (const ans of answers.concat({
        questionId: question.id,
        selectedOptionId: selectedOption!,
      })) {
        const questionMatch = quiz.questions.find(
          (q) => q.id === ans.questionId
        );
        const selected = questionMatch?.options.find(
          (o) => o.id === ans.selectedOptionId
        );
        if (selected?.isCorrect) correct++;
      }

      const durationSeconds = Math.floor((+endTime - +startTime) / 1000);
      const percentage = Math.round((correct / totalQuestions) * 100);

      try {
        await RequestHelper.post("Quiz/complete", {
          quizId: quiz.id,
          score: correct,
          totalQuestions,
          percentage,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationSeconds,
        });
        navigate("/quiz/finished");
      } catch (error) {
        handleError(error);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-xl">Quiz not found.</p>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-3xl bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-700">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{quiz.title}</h1>
            {quiz.description && (
              <p className="text-sm text-gray-400 italic">{quiz.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 bg-gray-700 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-gray-300">
              Question {currentQuestion + 1}
            </span>
            <span className="text-gray-500">/</span>
            <span className="text-sm text-gray-400">
              {quiz.questions.length}
            </span>
          </div>
        </div>

        <div className="w-full bg-gray-700 h-2.5 rounded-full mb-8 overflow-hidden">
          <div
            className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-500 ease-out"
            style={{
              width: `${
                ((currentQuestion + 1) / quiz.questions.length) * 100
              }%`,
            }}
          ></div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">
            {question.title}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-200 border-2 ${
                  selectedOption === option.id
                    ? "bg-green-500/10 border-green-500 text-green-400"
                    : "bg-gray-700/50 hover:bg-gray-700 border-gray-600 hover:border-gray-500 text-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedOption === option.id
                        ? "border-green-500 bg-green-500"
                        : "border-gray-500"
                    }`}
                  >
                    {selectedOption === option.id && (
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <span className="text-lg">{option.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            color="green"
            onClick={handleNext}
            disabled={selectedOption === null}
            className="cursor-pointer px-8 py-2.5 text-lg font-medium hover:scale-105 transition-transform duration-200"
          >
            {currentQuestion === quiz.questions.length - 1 ? (
              <span className="flex items-center gap-2">
                Finish Quiz
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Next
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
