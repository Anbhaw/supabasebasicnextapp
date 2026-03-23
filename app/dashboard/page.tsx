import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
        Welcome Home
      </h1>

      <div className="flex gap-4">
        <Link href="/medicaltests" className="text-blue-600 underline">
          Medical Tests
        </Link>

        <Link href="/testcategories" className="text-blue-600 underline">
          Test Categories
        </Link>

        <Link href="/uom" className="text-blue-600 underline">
          UOM
        </Link>
      </div>
    </div>
  );
}