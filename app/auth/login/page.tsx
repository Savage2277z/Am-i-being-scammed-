import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Log In — Am I Being Scammed?",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e] text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            Sign in to your account
          </p>
          <AuthForm mode="login" />
          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-[#1a1a2e] font-medium hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
