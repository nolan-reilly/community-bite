import { NextResponse } from "next/server";
import { DonationStatus, PrismaClient } from "@prisma/client";
import { getDonationPost } from "@/lib/prisma";

const prisma = new PrismaClient();

// POST: /api/donor/donation/modify
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

// PATCH: /api/donor/donation/modify   
export async function PATCH(req: Request) {
    try {
        const body = await req.json();
        const post_id = parseInt(body.post_id);
        const donor_email = body.donor_email;
    
        const donationPost = await getDonationPost(body.post_id);

        if (!donationPost) {
            return NextResponse.json({ success: false, error: "Donation post not found" }, { status: 404 });
        }
        // check if donationPost is owned by user
        if (donationPost.donor_email !== donor_email){
            return NextResponse.json({ success: false, error: "Forbidden delete request" }, { status: 401 });
        }

        await prisma.$transaction(async (prisma) => {
            // hide entry from donation post
            await prisma.donationPost.update({
            data: { donation_status: 'CLOSE' },
            where: { post_id: post_id }
            });

            // update all pending donation request
            await prisma.foodBankDonationRequest.updateMany({
            data: { 
                request_status: 'DECLINED',
                donation_status: 'CLOSE'
            },
            where: { 
                donation_id: post_id,
                request_status: 'PENDING'
            }
            });
        });
       
        return NextResponse.json({ success: true }, { status: 202 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}