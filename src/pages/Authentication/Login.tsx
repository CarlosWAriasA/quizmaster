import { FormEvent, useState, useContext, useEffect } from "react";
import Logo from "../../assets/logo.png";
import { Button, Label, TextInput } from "flowbite-react";
import { ToastHelper } from "../../utils/ToastHelper";
import { HiMail, HiLockClosed, HiArrowRight } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useErrorHandler } from "../../hooks/userErrorHandler";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";

const Login: React.FC = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { handleError } = useErrorHandler();
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("expired") === "true") {
      ToastHelper.warning("Your session expired. Please log in again.");
    }
  }, [location.search]);

  const validateEmail = (email: string): boolean => {
    const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      ToastHelper.warning("Please enter your email");
      return;
    }

    if (!validateEmail(email)) {
      ToastHelper.warning("Invalid email format");
      return;
    }

    if (!password) {
      ToastHelper.warning("Please enter your password");
      return;
    }

    if (password.length < 6) {
      ToastHelper.warning("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      ToastHelper.success("Login successful");
      navigate("/home");
    } catch (err) {
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
              QuizMaster
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              Welcome back! Please login to your account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <div className="relative">
                <TextInput
                  id="email"
                  type="email"
                  placeholder="you@example.com"
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
                  Sign In
                  <HiArrowRight className="w-5 h-5" />
                </span>
              </Button>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
              >
                Register here
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

export default Login;
