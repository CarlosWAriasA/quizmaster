"use client";
import { useEffect, useState, useCallback } from "react";
import { Button } from "flowbite-react";
import { RequestHelper } from "../../utils/RequestHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { HiPencilAlt, HiTrash, HiShare, HiDuplicate } from "react-icons/hi";
import { Tooltip, Modal } from "flowbite-react";
import { ToastHelper } from "../../utils/ToastHelper";

interface Quiz {
  id: number;
  title: string;
  description?: string;
  dateCreated: string;
  code?: string;
}

interface ListQuizResponse {
  data: Quiz[];
}

const MyQuizzes = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const { handleError } = useErrorHandler();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<number | null>(null);

  const fetchQuizzes = useCallback(async () => {
    try {
      const res = await RequestHelper.get<ListQuizResponse>("Quiz/listByUser");
      setQuizzes(res.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);

  const handleCreateNewQuiz = () => {
    navigate("/quiz/edit");
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const confirmDelete = (id: number) => {
    setQuizToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!quizToDelete) return;
    try {
      await RequestHelper.delete(`Quiz/${quizToDelete}`);
      setQuizzes((prev) => prev.filter((q) => q.id !== quizToDelete));
      fetchQuizzes();
      ToastHelper.success("Quiz deleted successfully");
    } catch (error) {
      handleError(error);
    } finally {
      setShowDeleteModal(false);
      setQuizToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <Modal
          show={showDeleteModal}
          size="md"
          popup
          onClose={() => setShowDeleteModal(false)}
        >
          <div className="p-6 text-center">
            <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-white">
              Are you sure you want to delete this Quiz?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="red"
                onClick={handleDelete}
                className="w-32 cursor-pointer"
              >
                Yes, delete
              </Button>
              <Button
                onClick={() => setShowDeleteModal(false)}
                className="w-24 cursor-pointer"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

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

        <div className="h-[75vh] overflow-y-auto p-2 rounded-lg bg-gray-800 border border-gray-700">
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
            <div className="grid gap-2">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-5 bg-gray-700 rounded-xl shadow-md border border-gray-600 hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {quiz.title}
                      </h2>
                      {quiz.description && (
                        <p className="text-gray-300">{quiz.description}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        Created on:{" "}
                        {new Date(quiz.dateCreated).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Tooltip content="Edit Quiz">
                        <Button
                          color="purple"
                          size="xs"
                          onClick={() => navigate(`/quiz/edit?id=${quiz.id}`)}
                          className="cursor-pointer"
                        >
                          <HiPencilAlt className="h-5 w-5" />
                        </Button>
                      </Tooltip>

                      <Tooltip content="Clone Quiz">
                        <Button
                          color="yellow"
                          size="xs"
                          onClick={() =>
                            navigate(`/quiz/edit?id=${quiz.id}&clone=true`)
                          }
                          className="cursor-pointer"
                        >
                          <HiDuplicate className="h-5 w-5" />
                        </Button>
                      </Tooltip>

                      <Tooltip content="Delete Quiz">
                        <Button
                          color="red"
                          size="xs"
                          onClick={() => confirmDelete(quiz.id)}
                          className="cursor-pointer"
                        >
                          <HiTrash className="h-5 w-5" />
                        </Button>
                      </Tooltip>

                      <Tooltip content="Share Quiz">
                        <Button
                          color="blue"
                          size="xs"
                          onClick={() => {
                            const shareUrl = `${window.location.origin}/quiz/take/code/${quiz.code}`;
                            navigator.clipboard.writeText(shareUrl);
                            ToastHelper.success(
                              "Quiz link copied to clipboard!"
                            );
                          }}
                          className="cursor-pointer"
                        >
                          <HiShare className="h-5 w-5" />
                        </Button>
                      </Tooltip>
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

export default MyQuizzes;
