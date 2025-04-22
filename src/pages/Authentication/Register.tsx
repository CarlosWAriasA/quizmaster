import React, { useState, FormEvent, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Logo from "../../assets/logo.png";
import { Button, Label, TextInput } from "flowbite-react";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 bg-opacity-80 p-8 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <img src={Logo} alt="QuizMaster Logo" className="w-16 h-16" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-gray-100 text-center mb-8">
          Create Your Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="fullname">Full Name</Label>
            <TextInput
              id="fullname"
              type="text"
              placeholder="John Doe"
              icon={HiUser}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <TextInput
              id="email"
              type="email"
              placeholder="name@example.com"
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

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <TextInput
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              icon={HiLockClosed}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          {loading ? (
            <LoadingSpinner width={50} height={50} />
          ) : (
            <Button type="submit" size="lg" className="w-full cursor-pointer">
              Register
            </Button>
          )}
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
