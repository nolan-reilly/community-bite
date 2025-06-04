import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAllDonationRequest, getBusinessID , getDonationPost} from "@/lib/prisma";

const prisma = new PrismaClient();

// POST: api/food-bank/donation/request/close
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const post_id = parseInt(body.post_id);
        const business_email = body.business_email;
        const business = await getBusinessID(business_email);
        
        if(!business){
            return NextResponse.json({ success: false, error: "bussined_id not found" }, { status: 404 }); 
        }

        const request = await prisma.foodBankDonationRequest.findFirst( { 
            where: { 
                donation_id: post_id,
                business_id: business.business_id,
                donation_status: "OPEN",
        }});

        if (!request) {
            return NextResponse.json({ success: false, error: "request not found" }, { status: 404 });
        }

        const toUpdate = await prisma.foodBankDonationRequest.update({
            where: {
              requestKey: {
                donation_id: post_id,
                business_id: business.business_id
              }
            },
            data:{
                donation_status: "CLOSE",
            }
          });

        return NextResponse.json({ success: true, message: "Donation closed successfully" }, { status: 202 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}