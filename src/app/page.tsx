import Image from "next/image";
import logo from "@/assets/logo.png"
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Rocket } from "lucide-react";
import heroImage from "@/assets/Hero-image.png"




export default function Home() {

  return (
    <div>
      
      <main className="relative flex min-h-screen items-center justify-center gap-6 bg-black px-5 py-12 text-white text-center md:text-start md:flex-row lg:gap-12 grid-background">
        
        <div className="z-10 max-w-prose space-y-3">
          <Image
            src={logo}
            alt="Logo"
            width={150}
            height={150}
            className="mx-auto md:ms-0"
          />

          <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20">
            Create the{" "}
            <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
              Perfect Resume
            </span>{" "}
            with{" "}
            <span className="inline-block gradient-title-hero">THEMES</span>
          </h1>

          <p className="text-lg text-white">
            Create stunning, professional resumes in minutes —{" "}
            <b>powered by AI</b>.
          </p>

          <Button asChild size="lg" variant="premium">
            <Link href="/resumes">
              Get Started <Rocket className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="hidden md:block z-20 relative">
            <Image
              src={heroImage}
              alt="Hero image"
              width={500}
              height={500}
              className="w-full max-w-sm h-auto object-contain rounded-lg"
              priority
            />
        </div>
      </main>
    </div>
  );
}
