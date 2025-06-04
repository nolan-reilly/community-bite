import Navbar from "@/components/Navbar";
import Container from "@/components/Container";
import { Button } from "../components/ui/button";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <div>
      <Navbar>
        <SearchBar />
      </Navbar>

      {/* Hero Section with Background Image */}
      <div className="relative mb-8 w-full h-[70vh] overflow-hidden">
        {/* The background image */}
        <Image
          src="/food-bank.jpg"
          alt="Community Background"
          fill
          className="object-cover object-center"
          priority
        />

        {/* semi-transparent layer to darken the background */}
        <div className="absolute inset-0 bg-black/30" />

        {/* Text Overlay */}
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center text-white max-w-xl px-4">
            <h1 className="text-4xl font-bold mb-4">Community Bite</h1>
            <p className="mb-6">
              Welcome to Community Bite, a platform dedicated to tackling hunger
              and food waste. We connect food donors, food banks, and charitable
              organizations to create an efficient and accessible system for
              food distribution.
            </p>
            <div className="flex gap-4 justify-center">
              <Button className="hover:bg-[#8BC733] text-white">
                <Link href="/login">Login</Link>
              </Button>
              <Button className="hover:bg-[#8BC733] text-white">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* <Container>
        <p>New content goes here</p>
      </Container> */}
    </div>
  );
}
