import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getFoodBankDonationRequests, getBusinessID, getAllDonationsWithStatus, getAllDonations } from "@/lib/prisma";

const prisma = new PrismaClient();

// GET: api/food-bank/donation/request/[email_id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const foodBank = await getBusinessID((await params).id);
        if (!foodBank) {
            return NextResponse.json(
            { success: false, error: "Food bank not found" },
            { status: 404 }
            );
        }
        const requests = await getFoodBankDonationRequests(foodBank.business_id);
        // const allDonations1 = await getAllDonationsWithStatus("PENDING"); --> this can help when filtering
        const allDonations = await getAllDonations();
        const posts = requests.map(request => {
            const matchedDonation = allDonations.find(
              donation => donation.post_id === request.donation_id
            );
            
            if (!matchedDonation) return null;
          
            return {
              ...matchedDonation,
              request_status: request.request_status,      // inject correct request_status as request_status
            };
          }).filter(post => post !== null);          
        
        return NextResponse.json({ success: true, posts }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}
