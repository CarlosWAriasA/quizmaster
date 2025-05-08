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
      <div className="min-h-screen flex justify-center items-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        <p>Quiz not found.</p>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
      <div className="w-full max-w-2xl bg-gray-800 rounded-xl shadow-xl p-8 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
          <span className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>

        {quiz.description && (
          <p className="text-sm text-gray-400 mb-6 italic">
            {quiz.description}
          </p>
        )}

        <div className="w-full bg-gray-700 h-2 rounded-full mb-6 overflow-hidden">
          <div
            className="bg-green-500 h-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestion + 1) / quiz.questions.length) * 100
              }%`,
            }}
          ></div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{question.title}</h2>

          <div className="grid gap-4">
            {question.options.map((option) => (
              <button
                key={option.id}
                onClick={() => setSelectedOption(option.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all border ${
                  selectedOption === option.id
                    ? "bg-green-600 border-green-400"
                    : "bg-gray-700 hover:bg-gray-600 border-gray-600"
                }`}
              >
                {option.title}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            color="green"
            onClick={handleNext}
            disabled={selectedOption === null}
            className="cursor-pointer px-6 py-2"
          >
            {currentQuestion === quiz.questions.length - 1
              ? "Finish Quiz"
              : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
