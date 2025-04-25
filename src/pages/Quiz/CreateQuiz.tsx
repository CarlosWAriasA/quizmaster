import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Label, TextInput, Textarea } from "flowbite-react";
import { ToastHelper } from "../../utils/ToastHelper";

interface Question {
  text: string;
  options: string[];
  correctIndexes: number[];
}

const CreateQuiz = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { text: "", options: ["", ""], correctIndexes: [] },
  ]);
  const [currentPage, setCurrentPage] = useState(0);

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
    updated[qIndex].options[oIndex] = value;
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
    updated[qIndex].options.push("");
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
      { text: "", options: ["", ""], correctIndexes: [] },
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

  const handleSubmit = () => {
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

    console.log({ title, description, questions });
    ToastHelper.success("Quiz created successfully");
  };

  const question = questions[currentPage];

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 md:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Quiz</h1>
          <Button
            color="gray"
            onClick={() => navigate("/home")}
            className="cursor-pointer"
          >
            Back
          </Button>
        </div>

        <div className="mb-6">
          <Label htmlFor="title">Title</Label>
          <TextInput
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 cursor-pointer"
          />
        </div>

        <div className="mb-8">
          <Label htmlFor="desc">Description (optional)</Label>
          <Textarea
            id="desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 cursor-pointer"
          />
        </div>

        {question && (
          <div className="mb-8 p-5 bg-gray-800 rounded-xl border border-gray-700">
            <div className="flex justify-between items-center mb-2">
              <Label>
                Question {currentPage + 1} of {questions.length}
              </Label>
              {questions.length > 1 && (
                <Button
                  color="red"
                  size="xs"
                  onClick={() => removeQuestion(currentPage)}
                  className="cursor-pointer"
                >
                  Remove
                </Button>
              )}
            </div>

            <TextInput
              placeholder="Enter question text"
              value={question.text}
              onChange={(e) =>
                handleQuestionChange(currentPage, e.target.value)
              }
              className="mb-4 cursor-pointer"
            />

            <div className="max-h-52 overflow-y-auto mb-4 p-2">
              {question.options.map((opt, oIndex) => (
                <div key={oIndex} className="flex items-center gap-2 mb-2">
                  <input
                    type="checkbox"
                    checked={question.correctIndexes.includes(oIndex)}
                    onChange={() => toggleCorrectOption(currentPage, oIndex)}
                    className="cursor-pointer"
                  />
                  <TextInput
                    value={opt}
                    placeholder={`Option ${oIndex + 1}`}
                    onChange={(e) =>
                      handleOptionChange(currentPage, oIndex, e.target.value)
                    }
                    className="flex-1 cursor-pointer"
                  />
                  {question.options.length > 2 && (
                    <Button
                      color="red"
                      size="xs"
                      onClick={() => removeOption(currentPage, oIndex)}
                      className="cursor-pointer"
                    >
                      X
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <Button
              size="xs"
              onClick={() => addOption(currentPage)}
              className="cursor-pointer"
              disabled={question.options.length >= 10}
            >
              + Add Option
            </Button>
          </div>
        )}

        <div className="flex justify-between mb-6">
          <Button
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="cursor-pointer"
            color={"yellow"}
          >
            Previous
          </Button>
          <Button
            disabled={currentPage === questions.length - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="cursor-pointer"
            color={"yellow"}
          >
            Next
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={addQuestion}
            color="blue"
            className="cursor-pointer"
            disabled={questions.length >= 50}
          >
            + Add Question
          </Button>

          <Button
            color="purple"
            onClick={handleSubmit}
            className="cursor-pointer"
          >
            Save Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateQuiz;
