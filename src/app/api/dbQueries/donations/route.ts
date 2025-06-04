import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAllDonations, } from "@/lib/prisma";

const prisma = new PrismaClient();
// GET: /api/dbQueries/donation
export async function GET(){

    try{
        const allDonations = await getAllDonations(); 

        return NextResponse.json({ success: true, allDonations}, { status: 200});
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}

export async function POST(req: Request) {
    try {
    
        const body = await req.json();

        const donation = await prisma.donationPost.create({
            data: {
                donor_email: body.donor_email,
                produce_name: body.produce,
                quantity: body.quantity,
                weight: body.weight,
                proposed_date: new Date(body.date),
                frequency: body.frequency,
                comment: body.comment,
            },
        });

        return NextResponse.json({ success: true, donation }, { status: 201 });
    } 
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}
