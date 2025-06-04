import { NextResponse } from "next/server";
import { getBusinessID, prisma } from "@/lib/prisma";
import { FoodBank } from "@prisma/client"

// PATCH /api/food-bank/inventory/modify-produce
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const user = await getBusinessID(body.business_email);
    const produce_name = body.produce_name;
    const quantity = parseInt(body.quantity, 10);

    if (!user) {
      return NextResponse.json({ success: false, error: "Food bank not found" }, { status: 404 });
    }
    
    if(quantity <= 0){
      return NextResponse.json({ success: false, error: "Quantity must be greater than 0" }, { status: 400 });
    }

    await prisma.inventory.update({
      where: {
        inventoryKey: {
          business_id: user.business_id,
          produce_name: produce_name,
        },
      },
      data: {
        quantity: quantity,
      },
    });

    return NextResponse.json({ success: true, message: "Produce updated successfully" }, { status: 200 });
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

// DELETE /api/food-bank/inventory/modify-produce
export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const user = await getBusinessID(body.business_email);
    const produce_name = body.produce_name;

    if (!user) {
      return NextResponse.json({ success: false, error: "Food bank not found" }, { status: 404 });
    }

    // delete the produce
    await prisma.inventory.delete({
      where: {
        inventoryKey: {
          business_id: user.business_id,
          produce_name: produce_name,
        },
      },
    });
    return NextResponse.json({ success: true, message: "Produce deleted successfully" }, { status: 200 });
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

