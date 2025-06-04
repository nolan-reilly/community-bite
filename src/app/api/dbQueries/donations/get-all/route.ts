import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAllDonations, } from "@/lib/prisma";

const prisma = new PrismaClient();

// GET: /api/donor/donation/get-all/
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