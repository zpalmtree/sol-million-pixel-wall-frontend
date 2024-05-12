/**
 * v0 by Vercel.
 * @see https://v0.dev/t/dBZAmpyDpGu
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function Component() {
  return (
    <>
      <header className="flex items-center justify-between bg-[#1a1a1a] px-6 py-4 shadow-md">
        <div className="flex items-center gap-8">
          <Link className="text-2xl font-bold tracking-tighter text-[#C19A6B]" href="/">
            The Million Pixel Wall
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link className="text-[#C19A6B] hover:text-white" href="/">
              Home
            </Link>
            <Link className="text-[#C19A6B] hover:text-white" href="/wall">
              Explore the Wall
            </Link>
            <Link className="text-[#C19A6B] hover:text-white" href="/wall">
              Buy Bricks
            </Link>
            <Link className="text-[#C19A6B] hover:text-white" href="/owned">
              My Bricks
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Button
            className="text-white hover:text-[#C19A6B] hover:bg-white/10 border border-[#C19A6B]"
            size="sm"
            variant="transparent"
          >
            Connect Wallet
          </Button>
        </div>
      </header>

      <main className="flex flex-col md:flex-row min-h-[calc(100vh_-_theme(spacing.16))] bg-[#1a1a1a]">
        <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4 md:px-0">
          <img
            alt="Pixel Grid"
            className="rounded-lg shadow-lg"
            height={400}
            src="/placeholder.svg"
            style={{
              aspectRatio: "400/400",
              objectFit: "cover",
            }}
            width={400}
          />
          <div className="flex items-center gap-4 bg-[#2d2d2d] p-4 rounded-lg shadow-lg w-full max-w-xs">
            <span className="text-white text-sm sm:text-base">Selected Bricks:</span>
            <span className="text-2xl font-bold text-[#C19A6B]">0</span>
          </div>

          <div className="flex items-center gap-4 bg-[#2d2d2d] p-4 rounded-lg shadow-lg w-full max-w-xs">
            <span className="text-white text-sm sm:text-base">Cost of Selected Bricks:</span>
            <span className="text-2xl font-bold text-[#C19A6B]">0 SOL</span>
          </div>

          <Button
            className="text-white hover:text-[#C19A6B] hover:bg-white/10 border border-[#C19A6B] w-full max-w-xs"
            size="sm"
            variant="transparent"
          >
            Purchase
          </Button>
        </div>
        <div className="w-full md:w-80 bg-[#1a1a1a] border-l border-[#2d2d2d] p-4 sm:p-6 flex flex-col gap-6">
          <div>
            <h2 className="text-xl font-bold text-[#C19A6B] mb-2">My Bricks</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <Button
                className="text-white hover:text-[#C19A6B] hover:bg-white/10 border border-[#C19A6B] w-full"
                size="sm"
                variant="transparent"
              >
                View Owned Bricks
              </Button>
              <Button
                className="text-white hover:text-[#C19A6B] hover:bg-white/10 border border-[#C19A6B] w-full"
                size="sm"
                variant="transparent"
              >
                Edit Owned Bricks
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row items-center justify-between w-full px-4 md:px-6 py-6 border-t border-[#C19A6B] bg-[#1A1A1A]">
        <p className="text-xs text-[#EEEEEE] dark:text-[#EEEEEE]">© 2024 Wall On Solana. All rights reserved.</p>
        <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-[#C19A6B]" href="https://twitter.com/WallOnSolana">
              Twitter
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-[#C19A6B]" href="http://wallonsolana.com/">
              Website
          </Link>
        </nav>
      </footer>
    </>
  )
}
