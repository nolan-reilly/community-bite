import { NextResponse } from "next/server";
import { getBusinessID, prisma } from "@/lib/prisma";

// POST: /api/food-bank/inventory/add-produce
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const user = await getBusinessID(body.business_email);

    if (!user) {
      return NextResponse.json({ success: false, error: "Food bank not found" }, { status: 404 });
    }

    const quantity = parseInt(body.quantity, 10);
    if(quantity <= 0){
      return NextResponse.json({ success: false, error: "Quantity must be greater than 0" }, { status: 400 });
    }
    
    // Add new or modify existing produce to inventory
    const existingProduce = await prisma.inventory.findFirst({
      where: {
      business_id: user.business_id,
      produce_name: {
        equals: body.produce_name,
        mode: "insensitive",
      },
      },
    });

    if (existingProduce) {
      await prisma.inventory.update({
      where: {
        inventoryKey: {
          business_id: existingProduce.business_id,
          produce_name: existingProduce.produce_name
        }
      },
      data: {
        quantity: { increment: quantity },
      },
      });
    } else {
      await prisma.inventory.create({
      data: {
        business_id: user.business_id,
        produce_name: body.produce_name,
        quantity: quantity,
      },
      });
    }

    return NextResponse.json({ success: true, message: "Produce added successfully" }, { status: 201 });
  } 
  catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    } 
    else {
      return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
    }
  }
}