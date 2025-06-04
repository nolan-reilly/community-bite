import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAllItemsInStore} from "@/lib/prisma";

const prisma = new PrismaClient();

// GET: /api/dbQueries/inventory/all
export async function GET(){

    try{
        const storeItems = await getAllItemsInStore(); 
        return NextResponse.json({ success: true, storeItems}, { status: 200});
    }
    catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}