import React, { useState, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";
import { Button, Label, TextInput } from "flowbite-react";
import { HiUser, HiMail, HiLockClosed, HiArrowRight } from "react-icons/hi";
import { ToastHelper } from "../../utils/ToastHelper";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Link } from "react-router-dom";

const Register: React.FC = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { handleError } = useErrorHandler();
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim()) {
      ToastHelper.warning("Please enter your full name");
      return;
    }
    if (fullName.length < 6) {
      ToastHelper.warning("Full name must be at least 6 characters long");
    }

    if (!email) {
      ToastHelper.warning("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      ToastHelper.warning("Please enter a valid email address");
      return;
    }
    if (!password) {
      ToastHelper.warning("Please enter your password");
      return;
    }
    if (password.length < 6) {
      ToastHelper.warning("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      ToastHelper.warning("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await register(fullName, email, password);
      ToastHelper.success("Account created successfully");
      navigate("/login");
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="w-full max-w-md mx-4">
        <div className="bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-purple-500 to-blue-500 p-1 rounded-full shadow-lg">
              <div className="bg-white rounded-full p-3">
                <img src={Logo} alt="QuizMaster Logo" className="w-16 h-16" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mt-4">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Join QuizMaster and start creating amazing quizzes!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullname" className="text-gray-300">
                Full Name
              </Label>
              <div className="relative">
                <TextInput
                  id="fullname"
                  type="text"
                  placeholder="John Doe"
                  icon={HiUser}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email Address
              </Label>
              <div className="relative">
                <TextInput
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  icon={HiMail}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <div className="relative">
                <TextInput
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  icon={HiLockClosed}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-gray-300">
                Confirm Password
              </Label>
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  icon={HiLockClosed}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-gray-700/50 border-gray-600 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-4">
                <LoadingSpinner width={40} height={40} />
              </div>
            ) : (
              <Button
                type="submit"
                color="purple"
                size="lg"
                className="w-full cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <span className="flex items-center justify-center gap-2">
                  Create Account
                  <HiArrowRight className="w-5 h-5" />
                </span>
              </Button>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} QuizMaster. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
