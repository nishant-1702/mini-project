
import Image from "next/image";
import img1 from "@/Images/img1.jpeg";

export default function Hero() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-gray-950 flex items-center justify-center p-4 sm:p-6 lg:p-8 -mt-16">

      {/* Background Image */}
      <Image
        src={img1}
        alt="Hero background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center"
      />

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Glass Container */}
      <section
        className="relative z-10 w-full max-w-3xl max-h-auto 
        rounded-2xl sm:rounded-3xl
        border border-white/20
        bg-white/8
        backdrop-blur-xl backdrop-saturate-150
        shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]
        p-5 sm:p-8 md:p-10 lg:p-12"
      >

        {/* Heading */}
        <div className="mx-auto mb-8 sm:mb-10 max-w-2xl text-center">

          <h1 className="text-xl md:-mt-10 sm:text-4xl md:text-xl font-bold tracking-tight text-white  ">
            Subscription App
          </h1>

          <p className=" text-sm sm:text-base md:text-lg text-gray-200">
            Choose a plan that works for you.
          </p>

        </div>

        {/* Subscription Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">

          {/* Free Plan */}
          <div
            className="group rounded-xl sm:rounded-2xl
            border border-white/20
            bg-white/[0.06]
            p-2 sm:p-3
            text-center
            transition-all duration-300
            hover:-translate-y-1
            hover:bg-white/[0.12]
            hover:border-white/40"
          >
            <h2 className="text-md sm:text-md font-semibold text-white">
              Free
            </h2>

            <p className="mt-2 text-xl sm:text-3xl font-bold text-white">
              ₹0
            </p>

            <p className="mt-2 text-sm text-gray-300">
              Free access
            </p>

            <button
              className="mt-2 w-full rounded-lg
              border border-white/30
              bg-white/10 px-2 py-2
              text-sm sm:text-base font-medium text-white
              transition-colors duration-300
              hover:bg-white/20
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-white"
            >
              Get Started
            </button>
          </div>

          {/* Silver Plan */}
          <div
            className="group rounded-xl sm:rounded-2xl
            border border-blue-400/60
            bg-blue-500/[0.12]
            p-2 sm:p-3
            text-center
            transition-all duration-300
            hover:-translate-y-1
            hover:bg-blue-500/20
            hover:border-blue-300"
          >
            <h2 className="text-md sm:text-lg font-semibold text-white">
              Silver
            </h2>

            <p className="mt-2 md:text-2xl sm:text-3xl font-bold text-blue-200">
              6 Hours
            </p>

            <p className="mt-2 text-sm text-gray-300">
              Silver subscription plan
            </p>

            <button
              className="mt-2 w-full rounded-lg
              bg-blue-500 px-4 py-2
              text-sm sm:text-base font-semibold text-white
              transition-colors duration-300
              hover:bg-blue-400
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              Choose Silver
            </button>
          </div>

          {/* Gold Plan */}
          <div
            className="group rounded-xl sm:rounded-2xl
            border border-yellow-400/60
            bg-yellow-500/[0.10]
            p-2 sm:p-3
            text-center
            transition-all duration-300
            hover:-translate-y-1
            hover:bg-yellow-500/20
            hover:border-yellow-300
            sm:col-span-2 lg:col-span-1"
          >
            <h2 className="text-md sm:text-lg font-semibold text-white">
              Gold
            </h2>

            <p className="mt-2 md:text-xl sm:text-3xl font-bold text-yellow-300">
              12 Hours
            </p>

            <p className="mt-2 text-sm text-gray-300">
              Gold subscription plan
            </p>

            <button
              className="mt-2 w-full rounded-lg
              bg-yellow-500 px-4 py-2
              text-sm sm:text-base font-semibold text-gray-950
              transition-colors duration-300
              hover:bg-yellow-400
              focus-visible:outline-none
              focus-visible:ring-2 focus-visible:ring-yellow-300"
            >
              Choose Gold
            </button>
          </div>

        </div>

      </section>
    </main>
  );
}