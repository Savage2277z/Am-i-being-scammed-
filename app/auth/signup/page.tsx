import Link from "next/link";
import AuthForm from "@/components/AuthForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up — Am I Being Scammed?",
};

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-128px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8">
          <h1 className="text-2xl font-bold text-[#1a1a2e] text-center mb-2">
            Create an Account
          </h1>
          <p className="text-gray-500 text-center text-sm mb-8">
            Get started with scam protection
          </p>
          <AuthForm mode="signup" />
          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#1a1a2e] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
