"use client";

import React, { useState } from "react";
import SearchBar from "@/components/SearchBar";
import Container from "@/components/Container";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar(props: {
  root?: string;
  children?: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { root = "/", children } = props;
  const pathname = usePathname();

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="py-4 border-b-2">
      <div className="w-[80%] mx-auto">
        <nav className="flex justify-between items-center">
          {/* Left: Logo / Title */}
          <div>
            <Link href="/" className="flex flex-row items-center gap-2">
              <Image
                src="/green-apple.png"
                alt="Green Apple"
                width={32}
                height={32}
              />

              <div className="flex flex-col">
                <p className="logo-font m-0 text-xl leading-none">Community</p>
                <p className="logo-font m-0 text-xl leading-none">Bite</p>
              </div>
            </Link>
          </div>

          {/* Middle: SearchBar (visible on all screens) */}
          {/* <div className="hidden lg:block">
            {pathname === "/" && <SearchBar />}
          </div> */}

          <div>{children}</div>

          {/* Desktop Navbar */}
          <div className="hidden lg:flex gap-4">
            <Button variant="link">
              <Link href={root}>Home</Link>
            </Button>

            <Button variant="link">
              <Link href={`/pantry-finder`}>Find Pantry</Link>
            </Button>

            <Button className="bg-[#8BC733] hover:bg-[#8BC733] transform transition-transform duration-200 hover:scale-110">
            <Link href="/donor/donation/form">Donate</Link>
            </Button>
            
          </div>

          {/* Menu Toggler */}
          <button
            onClick={handleToggle}
            className="lg:hidden p-2 focus:outline-none"
          >
            {isMenuOpen ? (
              <Image
                src="/menu-open.svg"
                alt="Open Menu"
                width={32}
                height={32}
              />
            ) : (
              <Image
                src="/menu-close.svg"
                alt="Close Menu"
                width={32}
                height={32}
              />
            )}
          </button>
        </nav>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="flex flex-col items-center mt-8 gap-4 lg:hidden">
            {pathname === "/" && <SearchBar />}

            <Button variant="link">
              <Link href={root}>Home</Link>
            </Button>

            <Button variant="link">
              <Link href={root}>Find Pantry</Link>
            </Button>

            <Button className="bg-amber-400">
              <Link href="/donation/form">Donate</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
