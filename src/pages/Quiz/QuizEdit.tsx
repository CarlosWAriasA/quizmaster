import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { ToastHelper } from "../../utils/ToastHelper";
import { RequestHelper } from "../../utils/RequestHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import { HiBackspace, HiOutlineTrash } from "react-icons/hi";

interface Option {
  id?: number;
  text: string;
}

interface Question {
  id?: number;
  text: string;
  options: Option[];
  correctIndexes: number[];
}

interface QuizOptionDTO {
  id: number;
  title: string;
  isCorrect: boolean;
  questionId: number;
}

interface QuizQuestionDTO {
  id: number;
  title: string;
  quizId: number;
  options: QuizOptionDTO[];
}

interface QuizDTO {
  id: number;
  title: string;
  description?: string;
  userId: number;
  questions: QuizQuestionDTO[];
}

const QuizEdit = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: [{ text: "" }, { text: "" }], correctIndexes: [] },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const { handleError } = useErrorHandler();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isClone = searchParams.get("clone") === "true";

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await RequestHelper.get<{ data: QuizDTO }>(`Quiz/${id}`);
      const quiz = res.data;
      setTitle(isClone ? `Copy of ${quiz.title}` : quiz.title);
      setDescription(quiz.description || "");
      setQuestions(
        quiz.questions.map((q) => ({
          id: q.id,
          text: q.title,
          options: q.options.map((opt) => ({
            id: opt.id,
            text: opt.title,
          })),
          correctIndexes: q.options
            .map((opt, idx) => (opt.isCorrect ? idx : -1))
            .filter((idx) => idx !== -1),
        }))
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [id, isClone, handleError]);

  useEffect(() => {
    if (id) {
      fetchQuiz();
    }
  }, [id, fetchQuiz]);

  const handleQuestionChange = (index: number, value: string) => {
    const updated = [...questions];
    updated[index].text = value;
    setQuestions(updated);
  };

  const handleOptionChange = (
    qIndex: number,
    oIndex: number,
    value: string
  ) => {
    const updated = [...questions];
    updated[qIndex].options[oIndex].text = value;
    setQuestions(updated);
  };

  const toggleCorrectOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    const current = updated[qIndex].correctIndexes;
    if (current.includes(oIndex)) {
      updated[qIndex].correctIndexes = current.filter((i) => i !== oIndex);
    } else {
      updated[qIndex].correctIndexes.push(oIndex);
    }
    setQuestions(updated);
  };

  const addOption = (qIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.push({ text: "" });
    setQuestions(updated);
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const updated = [...questions];
    updated[qIndex].options.splice(oIndex, 1);
    updated[qIndex].correctIndexes = updated[qIndex].correctIndexes.filter(
      (i) => i !== oIndex
    );
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: [{ text: "" }, { text: "" }], correctIndexes: [] },
    ]);
    setCurrentPage(questions.length);
  };

  const removeQuestion = (index: number) => {
    const updated = [...questions];
    updated.splice(index, 1);
    setQuestions(updated);
    if (currentPage >= updated.length) {
      setCurrentPage(updated.length - 1);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      ToastHelper.warning("Please enter a quiz title");
      return;
    }

    if (
      questions.some(
        (q) =>
          !q.text.trim() || q.options.length < 2 || q.options.some((o) => !o)
      )
    ) {
      ToastHelper.warning(
        "Each question must have text and at least 2 valid options"
      );
      return;
    }

    if (questions.some((q) => q.correctIndexes.length === 0)) {
      ToastHelper.warning(
        "Each question must have at least one correct answer"
      );
      return;
    }

    setLoading(true);
    try {
      const isCreating = !id || isClone;

      await RequestHelper.post(`Quiz/${isCreating ? "create" : "update"}`, {
        ...(isCreating ? {} : { Id: id }),
        Title: title,
        Description: description,
        Questions: questions.map((q) => ({
          Id: isCreating ? 0 : q.id || 0,
          Title: q.text,
          Options: q.options.map((opt, idx) => ({
            Id: isCreating ? 0 : opt.id || 0,
            Title: opt.text,
            IsCorrect: q.correctIndexes.includes(idx),
          })),
        })),
      });

      ToastHelper.success(
        isClone
          ? "Quiz cloned successfully"
          : isCreating
          ? "Quiz created successfully"
          : "Quiz updated successfully"
      );

      if (isCreating) {
        navigate("/quiz/list");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const question = questions[currentPage];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {loading && (
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
            <LoadingSpinner width={50} height={50} />
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button
              color="gray"
              onClick={() => navigate(-1)}
              className="cursor-pointer flex items-center gap-2 hover:scale-105 transition-transform duration-200"
            >
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              {isClone ? "Clone Quiz" : id ? "Edit Quiz" : "Create New Quiz"}
            </h1>
          </div>
        </div>

        <div className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
          <div className="mb-6">
            <Label htmlFor="title" className="text-lg font-medium mb-2 block">
              Title
            </Label>
            <TextInput
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 cursor-pointer bg-gray-700 border-gray-600 focus:border-purple-500"
              placeholder="Enter quiz title"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="desc" className="text-lg font-medium mb-2 block">
              Description (optional)
            </Label>
            <Textarea
              id="desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 cursor-pointer bg-gray-700 border-gray-600 focus:border-purple-500"
              placeholder="Enter quiz description"
            />
          </div>
        </div>

        {question && (
          <div className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium">
                  Question {currentPage + 1}
                </span>
                <span className="text-sm text-gray-400">
                  of {questions.length}
                </span>
              </div>
              {questions.length > 1 && (
                <Button
                  color="red"
                  size="xs"
                  onClick={() => removeQuestion(currentPage)}
                  className="cursor-pointer hover:scale-105 transition-transform duration-200"
                >
                  <HiBackspace className="h-5 w-5" />
                </Button>
              )}
            </div>

            <TextInput
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) =>
                handleQuestionChange(currentPage, e.target.value)
              }
              className="mb-6 cursor-pointer bg-gray-700 border-gray-600 focus:border-purple-500"
            />

            <div className="max-h-[15vh] overflow-y-auto mb-4 p-2 space-y-3">
              {question.options.map((opt, oIndex) => (
                <div
                  key={oIndex}
                  className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={question.correctIndexes.includes(oIndex)}
                    onChange={() => toggleCorrectOption(currentPage, oIndex)}
                    className="cursor-pointer w-5 h-5 text-purple-500 rounded focus:ring-purple-500"
                  />
                  <TextInput
                    value={opt?.text}
                    placeholder={`Option ${oIndex + 1}`}
                    onChange={(e) =>
                      handleOptionChange(currentPage, oIndex, e.target.value)
                    }
                    className="flex-1 cursor-pointer bg-gray-600 border-gray-500 focus:border-purple-500"
                  />
                  {question.options.length > 2 && (
                    <Button
                      color="red"
                      size="xs"
                      onClick={() => removeOption(currentPage, oIndex)}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200"
                    >
                      <HiOutlineTrash className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              size="xs"
              onClick={() => addOption(currentPage)}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              disabled={question.options.length >= 10}
            >
              + Add Option
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex justify-between mb-4">
            <Button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              color="yellow"
            >
              Previous
            </Button>
            <Button
              disabled={currentPage === questions.length - 1}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              color="yellow"
            >
              Next
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={addQuestion}
              color="blue"
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
              disabled={questions.length >= 50}
            >
              + Add Question
            </Button>

            <Button
              color="purple"
              onClick={handleSubmit}
              className="cursor-pointer flex justify-center items-center gap-2 hover:scale-105 transition-transform duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <LoadingSpinner width={20} height={20} />
                  Saving...
                </>
              ) : (
                "Save Quiz"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizEdit;
