import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// GET: /api/dbQueries/lookup/item/id
export async function GET(req: Request, { params }: { params: Promise<{ pattern: string }> }) {

    const _pattern = (await params).pattern;
    try {
        const businessesWithItem = await prisma.foodBank.findMany({
            select: {
              business_name: true, email: true, zipcode: true, city: true, street: true, state: true, country: true,
            },
            where: {
              inventory: {
                some: {
                  produce_name: {
                    contains: _pattern,
                    mode: "insensitive"
                  }
                }
              }
            }
          });

        return NextResponse.json({ success: true, businessesWithItem }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}