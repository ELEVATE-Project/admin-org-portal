import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login, getProfile, createUser } from "../api/api";
import {
  Eye,
  EyeOff,
  UserPlus,
  AlertCircle,
  ArrowLeft,
  LogIn,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";

const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    secret_code: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        setError("All fields are required");
        return false;
      }
    } else {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.secret_code
      ) {
        setError("All fields are required");
        return false;
      }
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const { access_token, user, refresh_token } = await login(formData);
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("refresh_token", refresh_token);

      const profileDetails = await getProfile(); // Use the getProfile function

      localStorage.setItem("user", JSON.stringify(profileDetails.data.result));

      setTimeout(() => navigate("/dashboard"), 500);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createUser(formData); // Use the createUser function

      // Show success message and switch to login
      setError("");
      setFormData({ name: "", email: "", password: "", secret_code: "" });
      setIsLogin(true);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-primary-600">Admin Portal</h1>
          <p className="text-gray-500">
            {isLogin
              ? "Welcome back! Please log in to continue."
              : "Create your admin account"}
          </p>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>{isLogin ? "Admin Login" : "Admin Sign Up"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Enter your credentials to access the admin dashboard"
                : "Fill in your details to create an admin account"}
            </CardDescription>
          </CardHeader>

          <form onSubmit={isLogin ? handleLogin : handleSignup}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full"
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pr-10"
                    autoComplete={isLogin ? "current-password" : "new-password"}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="secret_code">Secret Code</Label>
                  <Input
                    id="secret_code"
                    name="secret_code"
                    type="text"
                    placeholder="Enter the admin secret code"
                    value={formData.secret_code}
                    onChange={handleInputChange}
                    className="w-full"
                    disabled={isLoading}
                  />
                </div>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    {isLogin ? (
                      <>
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        Create Account
                      </>
                    )}
                  </div>
                )}
              </Button>

              <div className="flex items-center justify-between w-full text-sm">
                {isLogin ? (
                  <>
                    <button
                      type="button"
                      className="text-primary-600 hover:text-primary-700"
                      onClick={() => navigate("/forgot-password")}
                    >
                      Forgot password?
                    </button>
                    <button
                      type="button"
                      className="text-primary-600 hover:text-primary-700"
                      onClick={() => setIsLogin(false)}
                    >
                      Create account
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                    onClick={() => setIsLogin(true)}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to login
                  </button>
                )}
              </div>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-gray-500">
          This is a secure, encrypted connection. Your information is safe.
        </p>
      </div>
    </div>
  );
};

export default AuthForms;
