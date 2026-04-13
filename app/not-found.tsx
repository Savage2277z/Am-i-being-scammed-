import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-6xl font-bold text-[#1a1a2e]">404</h1>
      <p className="mt-4 text-lg text-gray-500">
        This page doesn&apos;t exist — but at least it&apos;s not a scam.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block px-6 py-3 bg-[#1a1a2e] text-white rounded-lg font-medium hover:bg-[#2a2a4e] transition-colors text-sm"
      >
        Go Home
      </Link>
    </div>
  );
}
