import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getAllDonationRequest, getBusinessID , getDonationPost} from "@/lib/prisma";

const prisma = new PrismaClient();

// POST: api/food-bank/donation/request/modify
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const donationPost = await getDonationPost(parseInt((body.post_id)));
        const business = await getBusinessID(body.business_email);

        if(!donationPost){
            return NextResponse.json({ success: false, error: "No such donation" }, { status: 500 });
        }
        if(!business){
            return NextResponse.json({ success: false, error: "No such food bank" }, { status: 500 });
        }

        await prisma.foodBankDonationRequest.create({
            data: {
            donation_id: body.post_id,
            business_id: (business.business_id),
            request_status: "PENDING"
            }
        });

        return NextResponse.json({ success: true, message: "Request sent" }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}

// DELETE: api/food-bank/donation/request/modify
export async function DELETE(req: Request) {
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
                business_id: business.business_id
        }})

        if (!request) {
            return NextResponse.json({ success: false, error: "request not found" }, { status: 404 });
        }

        const toDelete = await prisma.foodBankDonationRequest.delete({
            where: {
              requestKey: {
                donation_id: post_id,
                business_id: business.business_id
              }
            }
          });

        return NextResponse.json({ success: true, message: "Request deleted successfully" }, { status: 202 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}