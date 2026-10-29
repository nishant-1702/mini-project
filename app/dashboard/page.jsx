import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";

export default async function Dashboard() {
  await auth.protect();

  return (
    <main className="h-screen bg-gray-950 px-6 py-10 text-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-400">
          CineMeet
        </Link>

        <UserButton />
      </nav>

      <section className="mx-auto mt-16 max-w-6xl">
        <h1 className="text-4xl font-bold">
          Welcome to CineMeet 🎬
        </h1>

        <p className="mt-3 text-gray-400">
          Watch movies together, even when you are apart.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
            <h2 className="text-2xl font-semibold">
              Create a Room
            </h2>

            <p className="mt-3 text-gray-400">
              Start a watch party and invite your friends.
            </p>

            <button className="mt-6 rounded-lg bg-purple-600 px-5 py-3 font-medium hover:bg-purple-500">
              Create Room
            </button>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-8">
            <h2 className="text-2xl font-semibold">
              Join a Room
            </h2>

            <p className="mt-3 text-gray-400">
              Join your friends using a room code.
            </p>

            <button className="mt-6 rounded-lg border border-gray-700 px-5 py-3 font-medium hover:bg-gray-800">
              Join Room
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}