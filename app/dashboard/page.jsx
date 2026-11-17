import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { UserButton } from "@clerk/nextjs";
import { DropBox } from "@/components/DropBox";
import { CreateRoom } from "@/components/CreateRoom";

export default async function Dashboard() {
  await auth.protect();

  return (
    <main className="min-h-screen  -mt-16 bg-gray-950 px-6 py-40 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-purple-400">
          CineMeet
        </Link>

        <UserButton />
      </div>

      <section className="mx-auto mt-16 max-w-6xl">
        <h1 className="text-4xl font-bold">
          Welcome to CineMeet 🎬
        </h1>
       <DropBox/>

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

            
              <CreateRoom/>
            
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