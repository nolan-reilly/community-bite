import { NextResponse } from "next/server";
import { prisma, getBusinessID } from "@/lib/prisma";

// GET /api/food-bank/inventory/[id]
export async function GET(request: Request, {params}: { params: Promise<{id: string}> }) {
  // GET ALL OF THE FOOD BANKS INVENTORY
  try {
    // attempt to get foodbank email from request
    const foodBankEmail = (await params).id;

    if (!foodBankEmail) {
      return NextResponse.json({ success: false, error: "Food bank email is required" }, { status: 400 });
    }

    // attempt to get foodbank id using the email
    const foodBank = await getBusinessID(foodBankEmail);
    if (!foodBank) {
      return NextResponse.json({ success: false, error: "Food bank not found" }, { status: 404 });
    }

    // attempt to get foodbank inventory using the id
    const inventory = await prisma.inventory.findMany({
      where: { business_id: foodBank.business_id },
    });

    return NextResponse.json({ success: true, inventory }, { status: 200 });
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
