import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Textarea, Modal } from "flowbite-react";
import { ToastHelper } from "../../utils/ToastHelper";
import { RequestHelper } from "../../utils/RequestHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSearchParams } from "react-router-dom";
import {
  HiBackspace,
  HiOutlineTrash,
  HiX,
  HiLightBulb,
  HiQuestionMarkCircle,
  HiArrowLeft,
} from "react-icons/hi";

const API_KEY = import.meta.env.VITE_DEEPSEEK_KEY;

interface Option {
  id?: number;
  text: string;
}

interface Question {
  id?: number;
  text: string;
  options: Option[];
  correctIndexes: number[];
  randomOptions: boolean;
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
  randomOptions: boolean;
}

interface QuizDTO {
  id: number;
  title: string;
  description?: string;
  userId: number;
  questions: QuizQuestionDTO[];
  randomQuestions: boolean;
}

const QuizEdit = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([
    {
      text: "",
      options: [{ text: "" }, { text: "" }],
      correctIndexes: [],
      randomOptions: false,
    },
  ]);
  const [currentPage, setCurrentPage] = useState(0);
  const { handleError } = useErrorHandler();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const isClone = searchParams.get("clone") === "true";
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [generating, setGenerating] = useState(false);
  const [randomQuestions, setrandomQuestions] = useState(false);

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    try {
      const res = await RequestHelper.get<{ data: QuizDTO }>(`Quiz/${id}`);
      const quiz = res.data;
      setTitle(isClone ? `Copy of ${quiz.title}` : quiz.title);
      setDescription(quiz.description || "");
      setrandomQuestions(quiz.randomQuestions);
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
          randomOptions: q.randomOptions || false,
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
      {
        text: "",
        options: [{ text: "" }, { text: "" }],
        correctIndexes: [],
        randomOptions: false,
      },
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
        randomQuestions: randomQuestions,
        Questions: questions.map((q) => ({
          Id: isCreating ? 0 : q.id || 0,
          Title: q.text,
          RandomizeOptions: q.randomOptions,
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

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      ToastHelper.warning("Please enter a topic");
      return;
    }

    if (numQuestions < 1 || numQuestions > 20) {
      ToastHelper.warning("Number of questions must be between 1 and 20");
      return;
    }

    setGenerating(true);
    try {
      const generatedQuestions = await generateQuizWithIA(topic, numQuestions);
      setQuestions(generatedQuestions);
      setTitle(`Quiz about ${topic}`);
      setShowGenerateModal(false);
      ToastHelper.success("Quiz generated successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      setGenerating(false);
    }
  };

  const extractJsonFromText = (text: string) => {
    const firstBracket = text.indexOf("[");
    const lastBracket = text.lastIndexOf("]");
    if (
      firstBracket === -1 ||
      lastBracket === -1 ||
      firstBracket >= lastBracket
    ) {
      throw new Error("No valid JSON array found in the text.");
    }
    return text.slice(firstBracket, lastBracket + 1);
  };

  const generateQuizWithIA = async (topic: string, numQuestions: number) => {
    const prompt = `
    Generate a quiz with ${numQuestions} questions about "${topic}".
    Each question must have at least 4 answer options.
    Some questions may have **one correct answer**, others may have **multiple correct answers**.
    Use the "correctIndexes" array to indicate the index(es) of the correct option(s).

    Respond strictly in pure JSON format like this:

    [
      {
        "text": "Which of the following are planets?",
        "options": [
          { "text": "Earth" },
          { "text": "Sun" },
          { "text": "Mars" },
          { "text": "Venus" }
        ],
        "correctIndexes": [0, 2, 3]
      },
      {
        "text": "Who was the first emperor of Rome?",
        "options": [
          { "text": "Julius Caesar" },
          { "text": "Augustus" },
          { "text": "Nero" },
          { "text": "Caligula" }
        ],
        "correctIndexes": [1]
      }
    ]

    **Do NOT include any extra text, explanation, or greetings outside the JSON array.**
    `;

    try {
      const response = await fetch(
        "https://api.deepseek.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY.trim()}`,
          },
          body: JSON.stringify({
            model: "deepseek-chat",
            messages: [
              {
                role: "system",
                content:
                  "You are a quiz generator that always responds with pure JSON format.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            temperature: 0.5,
            max_tokens: 1500,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new Error("The AI didn't return a valid response.");
      }

      const jsonOnly = extractJsonFromText(content);
      const generatedQuestions = JSON.parse(jsonOnly);

      return generatedQuestions;
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw error;
    }
  };

  const question = questions[currentPage];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        {loading && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
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
              <HiArrowLeft className="w-5 h-5" />
              Back
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              {isClone ? "Clone Quiz" : id ? "Edit Quiz" : "Create New Quiz"}
            </h1>
          </div>
          <Button
            color="purple"
            onClick={() => setShowGenerateModal(true)}
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
          >
            Generate with AI
          </Button>
        </div>

        <div className="mb-8 p-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg relative">
          <div className="mb-6">
            <Label htmlFor="title" className="text-lg font-medium mb-2 block">
              Title
            </Label>
            <TextInput
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full cursor-pointer bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg transition-all duration-200 hover:bg-gray-700"
              placeholder="Enter a descriptive title for your quiz..."
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
              className="mt-1 cursor-pointer bg-gray-700 border-gray-600 focus:border-purple-500 focus:ring-purple-500"
              placeholder="Enter quiz description"
            />
          </div>

          <div className="flex items-center w-1/2 gap-2 bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600">
            <input
              type="checkbox"
              id="randomQuestions"
              checked={randomQuestions}
              onChange={(e) => setrandomQuestions(e.target.checked)}
              className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500 border-gray-600 bg-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-600"
            />
            <Label
              htmlFor="randomQuestions"
              className="text-white text-sm font-medium cursor-pointer hover:text-purple-300 transition-colors duration-200"
            >
              Randomize Questions Order
            </Label>
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
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 mr-2 bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600">
                  <input
                    type="checkbox"
                    id={`randomize-options-${currentPage}`}
                    checked={question.randomOptions}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[currentPage].randomOptions = e.target.checked;
                      setQuestions(updated);
                    }}
                    className="w-4 h-4 text-purple-500 rounded focus:ring-purple-500 border-gray-600 bg-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-600"
                  />
                  <Label
                    htmlFor={`randomize-options-${currentPage}`}
                    className="text-white text-sm font-medium cursor-pointer hover:text-purple-300 transition-colors duration-200"
                  >
                    Randomize Options Order
                  </Label>
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
            </div>

            <TextInput
              id={`question-${currentPage}`}
              placeholder="Enter your question here..."
              value={question.text}
              onChange={(e) =>
                handleQuestionChange(currentPage, e.target.value)
              }
              className="w-full cursor-pointer bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg transition-all duration-200 hover:bg-gray-700 mb-2"
            />

            <div className="max-h-[30vh] overflow-y-auto mb-4 p-2 space-y-3">
              {question.options.map((opt, oIndex) => (
                <div
                  key={oIndex}
                  className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg"
                >
                  <input
                    type="checkbox"
                    checked={question.correctIndexes.includes(oIndex)}
                    onChange={() => toggleCorrectOption(currentPage, oIndex)}
                    className="cursor-pointer w-5 h-5 text-purple-500 rounded focus:ring-purple-500 border-gray-600 bg-gray-700"
                  />
                  <TextInput
                    value={opt?.text}
                    placeholder={`Option ${oIndex + 1}`}
                    onChange={(e) =>
                      handleOptionChange(currentPage, oIndex, e.target.value)
                    }
                    className="flex-1 cursor-pointer bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg transition-all duration-200 hover:bg-gray-700"
                  />
                  {question.options.length > 2 && (
                    <Button
                      color="red"
                      size="xs"
                      onClick={() => removeOption(currentPage, oIndex)}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200 rounded-lg"
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

        <Modal
          show={showGenerateModal}
          size="lg"
          popup
          onClose={() => setShowGenerateModal(false)}
        >
          <div className="bg-gray-800 text-white rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <HiLightBulb className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-medium">Generate Quiz with AI</h3>
              </div>
              <Button
                color="gray"
                size="xs"
                disabled={generating}
                onClick={() => setShowGenerateModal(false)}
                className="cursor-pointer hover:scale-105 transition-transform duration-200"
              >
                <HiX className="w-5 h-5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="topic" className="text-white">
                      Topic
                    </Label>
                    <HiQuestionMarkCircle
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      title="Enter the subject or topic for your quiz (e.g., Physics, History, Math)"
                    />
                  </div>
                  <TextInput
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Physics, History, Math"
                    className="bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg transition-all duration-200 hover:bg-gray-700"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="numQuestions" className="text-white">
                      Number of Questions
                    </Label>
                    <HiQuestionMarkCircle
                      className="w-4 h-4 text-gray-400 cursor-pointer"
                      title="Choose how many questions you want in your quiz (1-20)"
                    />
                  </div>
                  <TextInput
                    id="numQuestions"
                    type="number"
                    min="1"
                    max="20"
                    value={numQuestions}
                    onChange={(e) =>
                      setNumQuestions(parseInt(e.target.value) || 1)
                    }
                    className="bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500 rounded-lg transition-all duration-200 hover:bg-gray-700"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-700 flex gap-3">
              <Button
                color="gray"
                disabled={generating}
                onClick={() => setShowGenerateModal(false)}
                className="flex-1 cursor-pointer hover:scale-105 transition-transform duration-200 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                color="purple"
                onClick={handleGenerateQuiz}
                disabled={generating}
                className="flex-1 cursor-pointer hover:scale-105 transition-transform duration-200 rounded-lg"
              >
                {generating ? (
                  <>
                    <LoadingSpinner width={20} height={20} />
                    <span className="ml-2">Generating...</span>
                  </>
                ) : (
                  <>
                    <HiLightBulb className="w-5 h-5 mr-2" />
                    Generate Quiz
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default QuizEdit;
