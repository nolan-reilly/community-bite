import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

const SUPER_SECRET = process.env.JWT_SUPER_SECRET || 'supersecret';

function generateAccessToken(email: string, role: "food-bank") {
  return jwt.sign({ email, role }, SUPER_SECRET, { expiresIn: '30d' });
}

// POST /api/login/food-bank
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Check if email was provided
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    // Check if password was provided
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    // Check if email exists
    const existingUser = await prisma.foodBank.findUnique({
      where: { email }
    });
    if (!existingUser) {
      return NextResponse.json({ error: "Email does not exist" }, { status: 400 });
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    // Generate JWT token
    const token = generateAccessToken(existingUser.email, "food-bank");

    return NextResponse.json({ message: "Logged in successfully", token }, { status: 200 });
  } 
  catch (error) {
    return NextResponse.json({ error: "Error logging in" }, { status: 400 });
  }
}
