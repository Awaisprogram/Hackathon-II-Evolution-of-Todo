'use client'

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, MailCheck, TriangleAlert, Lock, Sparkles, Eye, EyeOff, Mail } from "lucide-react";

// UI Components
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsPending(true);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
      } else {
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsPending(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      setError('Failed to sign in with Google');
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-950 text-slate-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 flex-col justify-between p-12 fixed left-0 top-0 h-screen overflow-hidden z-10">
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-center space-y-8">
            <Link href="/" rel="noopener noreferrer">
              <Image
                src="/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="mx-auto"
              />
            </Link>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-white">ToDoze</h1>
              <p className="text-lg text-slate-400 max-w-md">
                Welcome back! Sign in to continue managing your tasks and boost your productivity.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 lg:w-1/2 lg:ml-[50%] flex flex-col min-h-screen lg:min-h-0">
        <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="w-full max-w-lg space-y-2">
            {/* Mobile Logo */}
            <Link href="/" className="lg:hidden block">
              <Image
                src="/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="mx-auto my-6"
              />
            </Link>
            
            <Card className="border-0 shadow-none bg-transparent">
              <CardHeader className="text-center space-y-0 pb-4">
                <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base sm:text-lg mt-2 text-slate-400">
                  Sign in to continue to TodoApp
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Success Message */}
                {success && (
                  <div
                    className="mt-4 rounded-md border border-emerald-200/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300"
                    role="status"
                  >
                    <MailCheck className="w-4 h-4 mr-2 inline-block" />
                    <p className="inline-block">{success}</p>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="mt-4 bg-red-900/30 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-300">
                    <TriangleAlert className="size-4" />
                    <p>{error}</p>
                  </div>
                )}

                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-base sm:text-lg text-slate-300">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="h-10 sm:h-12 text-base sm:text-lg bg-slate-800 border-slate-700 text-white pl-10"
                        disabled={isPending}
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base sm:text-lg text-slate-300">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="h-10 sm:h-12 text-base sm:text-lg bg-slate-800 border-slate-700 text-white pl-10 pr-10"
                        disabled={isPending}
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-500" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        type="checkbox"
                        className="h-4 w-4 rounded border-slate-600 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <Label htmlFor="remember-me" className="ml-2 text-sm text-slate-400">
                        Remember me
                      </Label>
                    </div>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-10 sm:h-12 text-base sm:text-lg bg-gradient-to-r from-blue-600 to-cyan-600 border-none text-white hover:text-white hover:from-blue-700 hover:to-cyan-700 cursor-pointer"
                    disabled={isPending}
                    size="lg"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 size-5 animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      "Sign in"
                    )}
                  </Button>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-slate-950 text-slate-400">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGoogleSignIn}
                    disabled={isPending}
                    className="w-full h-10 sm:h-12 text-base sm:text-lg bg-slate-800 border-slate-700 text-white hover:bg-slate-700 hover:text-white cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </Button>

                  <div className="text-center text-sm sm:text-base text-slate-400 mt-4">
                    Don't have an account?{' '}
                    <Link
                      href="/register"
                      className="font-bold text-blue-500 hover:text-blue-400 transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

