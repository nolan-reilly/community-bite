import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getBusinessID, getFoodBankDonationRequestsStatus } from "@/lib/prisma";

const prisma = new PrismaClient();

// GET: /api/food-bank/donation/request/status/cs442@test.com?post_id=4
export async function GET(req: Request, { params }: { params: Promise<{ id: string, post_id: string }> }) {
    try {
        const { searchParams } = new URL(req.url);
        const user_email = (await params).id;

        const post_id_str = searchParams.get("post_id");
        if (!post_id_str) {
            return NextResponse.json({ success: false, error: "post id is required" }, { status: 500 });
        }
        const post_id = parseInt(post_id_str);
        const request = await prisma.foodBankDonationRequest.findFirst({ where: { donation_id: post_id } });
        if( !request){
            return NextResponse.json({ success: false, error: "No such donation" }, { status: 500 });
        }
        
        const business = await getBusinessID(user_email);
        if(!business){
            return NextResponse.json({ success: false, error: "FoodBank not found" }, { status: 500 });
        }

        const status = await getFoodBankDonationRequestsStatus(business.business_id, post_id);
        if(!status?.request_status){
            return NextResponse.json({ success: false, error: "No such request" }, { status: 500 });
        }

        return NextResponse.json({ success: true, request_status: status.request_status.toString() }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}