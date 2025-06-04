import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getBusinessID, getAllItemsInStore } from "@/lib/prisma";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getBusinessID(body.business_email);

    if (!user) {
      return NextResponse.json({ success: false, error: "Food bank not found" }, { status: 404 });
    }

    // Ensure quantity is a number
    const quantity = parseInt(body.quantity, 10);
    if (isNaN(quantity)) {
      return NextResponse.json({ success: false, error: "Invalid quantity" }, { status: 400 });
    }
    
    // Check if produce already exists in inventory
    const existingProduct = await prisma.inventory.findFirst({
      where: {
        business_id: user.business_id,
        produce_name: body.produce_name,
      },
    });

    if (existingProduct) {
      return NextResponse.json({ success: false, error: "Produce already exists!" }, { status: 400 });
    }

    // Insert new produce into inventory
    await prisma.inventory.create({
      data: {
        business_id: user.business_id,
        produce_name: body.produce_name,
        quantity: quantity,
      },
    });

    return NextResponse.json({ success: true, message: "Produce added successfully" }, { status: 201 });
  } 
  catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}