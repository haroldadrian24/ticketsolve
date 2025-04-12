"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { AlertCircle, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (rateLimited) {
        setError("Too many login attempts. Please try again later.");
        setIsLoading(false);
        return;
      }

      if (!studentId.trim() || !password.trim()) {
        setError("Please enter both student ID and password");
        setIsLoading(false);
        return;
      }

      // Call the API route for authentication
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Successful login
        router.push("/dashboard");
      } else {
        // Failed login
        setError(data.message || "Invalid credentials");

        // Simulate rate limiting after 5 failed attempts
        const attemptCount =
          parseInt(localStorage.getItem("loginAttempts") || "0") + 1;
        localStorage.setItem("loginAttempts", attemptCount.toString());

        if (attemptCount >= 5) {
          setRateLimited(true);
          setError("Too many login attempts. Please try again in 1 minute.");

          // Reset rate limit after 1 minute
          setTimeout(() => {
            setRateLimited(false);
            localStorage.setItem("loginAttempts", "0");
          }, 60000);
        }
      }
    } catch (err) {
      setError("An error occurred during login. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            TickSolve
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                id="studentId"
                placeholder="Student ID"
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                disabled={isLoading || rateLimited}
                className="w-full"
                autoComplete="username"
              />
            </div>

            <div className="space-y-2 relative">
              <Input
                id="password"
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading || rateLimited}
                className="w-full pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || rateLimited}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <p className="text-xs text-center text-gray-500 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register here
            </Link>
          </p>
          {rateLimited && (
            <div className="flex items-center justify-center text-amber-500 text-sm">
              <ExclamationTriangleIcon className="mr-2 h-4 w-4" />
              <span>Rate limit exceeded. Please wait 1 minute.</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
