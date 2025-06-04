"use client";
import Container from "@/components/Container";
import Image from "next/image";
import userRoleProtection from "@/hooks/userRoleProtection";
import Navbar from "@/components/Navbar";

export default function HomePage() {
  userRoleProtection("food-bank");
  return (
    <div>
      <Navbar root="/food-bank"></Navbar>

      <Container>
        <div className="flex justify-between gap-8">
          <div className="flex-1">
            <p className="text-2xl font-bold mb-4">Community Bite</p>
            <p className="mb-4">
              Welcome to Community Bite, a platform dedicated to tackling hunger
              and food waste. We connect food donors, food banks, and charitable
              organizations to create an efficient and accessible system for
              food distribution.
              <br></br> <br></br>
              Our goal is to ensure that surplus food reaches individuals and
              families in need, reducing waste and strengthening our
              communities.
              <br></br>Join us in making a real difference – shop, donate,
              volunteer, or learn more about how you can help.
              <br></br> <br></br>
              We believe that by working together, we can create a sustainable
              and hunger-free world.
            </p>
          </div>
          <div className="flex-1 bg-grey-300 p-4">
            <Image
              src="/community.jpeg"
              alt="Community"
              layout="responsive"
              width={500}
              height={300}
            />
          </div>
        </div>
      </Container>
    </div>
  );
}
