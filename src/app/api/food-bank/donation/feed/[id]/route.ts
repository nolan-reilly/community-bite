import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getFoodBankDonationRequests, getBusinessID, getAllDonationsWithStatus } from "@/lib/prisma";

const prisma = new PrismaClient();

// GET: /api/food-bank/donation/feed/[email]
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
        const allDonations = await getAllDonationsWithStatus("OPEN");
        const posts = allDonations
            .filter(donation => !requests.some(request => request.donation_id === donation.post_id));

        return NextResponse.json({ success: true, posts }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}
