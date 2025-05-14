import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Radio, Checkbox } from "flowbite-react";
import { RequestHelper } from "../../utils/RequestHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiCheck, HiArrowRight } from "react-icons/hi";

interface QuizOption {
  id: number;
  title: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  id: number;
  title: string;
  options: QuizOption[];
}

interface Quiz {
  id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

interface Answer {
  questionId: number;
  selectedOptionId?: number | null;
  selectedOptionIds?: number[];
}

const TakeQuiz = () => {
  const { id, code } = useParams();
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(new Date());
  const [answers, setAnswers] = useState<Answer[]>([]);

  // Efecto para cargar el quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = id
          ? await RequestHelper.get<{ data: Quiz }>(`Quiz/${id}`)
          : await RequestHelper.get<{ data: Quiz }>(`Quiz/by-code/${code}`);

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

  const currentQuestionData = quiz?.questions[currentQuestion];
  const isMultipleChoice =
    (currentQuestionData?.options?.filter((opt) => opt.isCorrect).length ?? 0) >
    1;

  const handleOptionSelect = (optionId: number) => {
    if (!currentQuestionData) return;

    if (isMultipleChoice) {
      setSelectedOptions((prev) =>
        prev.includes(optionId)
          ? prev.filter((id) => id !== optionId)
          : [...prev, optionId]
      );
    } else {
      setSelectedOption(optionId);
    }
  };

  const isAnswerCorrect = (question: QuizQuestion, answer: Answer): boolean => {
    if (isMultipleChoice) {
      const correctOptions = question.options
        .filter((opt) => opt.isCorrect)
        .map((opt) => opt.id);
      return (
        correctOptions.length === answer.selectedOptionIds?.length &&
        correctOptions.every((id) => answer.selectedOptionIds?.includes(id))
      );
    } else {
      const selected = question.options.find(
        (o) => o.id === answer.selectedOptionId
      );
      return selected?.isCorrect || false;
    }
  };

  const handleNext = async () => {
    if (!quiz || !currentQuestionData) return;

    const currentAnswer: Answer = {
      questionId: currentQuestionData.id,
      ...(isMultipleChoice
        ? { selectedOptionIds: selectedOptions }
        : { selectedOptionId: selectedOption }),
    };
    setAnswers((prev) => [...prev, currentAnswer]);

    const isLast = currentQuestion === quiz.questions.length - 1;

    if (isLast) {
      const endTime = new Date();
      const totalQuestions = quiz.questions.length;
      const correctAnswers = answers
        .concat(currentAnswer)
        .filter((ans, index) =>
          isAnswerCorrect(quiz.questions[index], ans)
        ).length;

      try {
        await RequestHelper.post("Quiz/complete", {
          quizId: quiz.id,
          score: correctAnswers,
          totalQuestions,
          percentage: Math.round((correctAnswers / totalQuestions) * 100),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          durationSeconds: Math.floor((+endTime - +startTime) / 1000),
        });
        navigate("/quiz/finished");
      } catch (error) {
        handleError(error);
      }
    } else {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setSelectedOptions([]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800">
        <LoadingSpinner />
      </div>
    );
  }

  if (!quiz || !currentQuestionData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="text-center p-8 bg-gray-800 rounded-xl border border-gray-700">
          <p className="text-xl">Quiz not found.</p>
        </div>
      </div>
    );
  }

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
          />
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-6 text-gray-100">
            {currentQuestionData.title}
          </h2>
          <div className="grid gap-4">
            {currentQuestionData.options.map((option) => {
              const isSelected = isMultipleChoice
                ? selectedOptions.includes(option.id)
                : selectedOption === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full text-left px-6 py-4 rounded-xl transition-all duration-200 border-2 ${
                    isSelected
                      ? "bg-green-500/10 border-green-500 text-green-400"
                      : "bg-gray-700/50 hover:bg-gray-700 border-gray-600 hover:border-gray-500 text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {isMultipleChoice ? (
                      <Checkbox
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-5 h-5"
                        color="green"
                      />
                    ) : (
                      <Radio
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-5 h-5"
                        color="green"
                      />
                    )}
                    <span className="text-lg">{option.title}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            color="green"
            onClick={handleNext}
            disabled={
              isMultipleChoice
                ? selectedOptions.length === 0
                : selectedOption === null
            }
            className="cursor-pointer px-8 py-2.5 text-lg font-medium hover:scale-105 transition-transform duration-200"
          >
            <span className="flex items-center gap-2">
              {currentQuestion === quiz.questions.length - 1 ? (
                <>
                  Finish Quiz
                  <HiCheck className="w-5 h-5" />
                </>
              ) : (
                <>
                  Next
                  <HiArrowRight className="w-5 h-5" />
                </>
              )}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TakeQuiz;
