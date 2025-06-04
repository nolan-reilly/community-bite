import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// GET: /api/dbQueries/lookup/pantry/id
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {

    const name = (await params).id;
    console.log(name);
    try {
        const businessesWithName = await prisma.foodBank.findMany({
            select: {
              business_name: true, email: true, zipcode: true, city: true, street: true, state: true, country: true,
            },
            where: {
              business_name: {
                contains: name,
                mode: "insensitive"
              }
            }
          });

        return NextResponse.json({ success: true, businessesWithName }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}