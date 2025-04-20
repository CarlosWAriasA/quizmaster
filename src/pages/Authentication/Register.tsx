import React, { useState, FormEvent } from "react";
import Logo from "../../assets/logo.png";
import { Button, Label, TextInput } from "flowbite-react";
import { HiUser, HiMail, HiLockClosed } from "react-icons/hi";
import { ToastHelper } from "../../utils/ToastHelper";

const Register: React.FC = () => {
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const validateEmail = (email: string): boolean => {
    const regex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    return regex.test(email);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fullName.trim()) {
      ToastHelper.error("Please enter your full name");
      return;
    }
    if (!email) {
      ToastHelper.error("Please enter your email address");
      return;
    }
    if (!validateEmail(email)) {
      ToastHelper.error("Please enter a valid email address");
      return;
    }
    if (!password) {
      ToastHelper.error("Please enter your password");
      return;
    }
    if (password.length < 6) {
      ToastHelper.warning("Password must be at least 6 characters long");
      return;
    }
    if (password !== confirmPassword) {
      ToastHelper.error("Passwords do not match");
      return;
    }

    // Aquí iría la llamada al backend para registrar usuario
    ToastHelper.success("Account created successfully");
    // opcional: limpiar campos o redirigir a /login
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
              required
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
              required
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
              required
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
              required
              icon={HiLockClosed}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1"
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Register
          </Button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
