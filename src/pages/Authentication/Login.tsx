import { FormEvent, useState, useContext } from "react";
import Logo from "../../assets/logo.png";
import { Button, Label, TextInput } from "flowbite-react";
import { ToastHelper } from "../../utils/ToastHelper";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <img src={Logo} alt="QuizMaster Logo" className="w-16 h-16" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">
          QuizMaster
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="email">Email</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="you@example.com"
              icon={HiMail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              type="password"
              placeholder="••••••••"
              icon={HiLockClosed}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          {loading ? (
            <LoadingSpinner width={50} height={50} />
          ) : (
            <Button
              type="submit"
              color={"purple"}
              size="lg"
              className="w-full cursor-pointer"
            >
              Sign In
            </Button>
          )}
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
