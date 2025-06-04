import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getUserDonations, getUserDonationsWithStatus } from "@/lib/prisma";
import { DonationStatus } from "@prisma/client";

const prisma = new PrismaClient();

// GET: api/donor/donation/[email_id]?donation_status="donation_status"
export async function GET(req: Request, { params }: { params: Promise<{ id: string, donation_status: DonationStatus}> }) {
    try {
        const { searchParams } = new URL(req.url);
        const user_email = (await params).id;

        const donation_status = searchParams.get("donation_status") as DonationStatus | null;
        const allDonations = donation_status && Object.values(DonationStatus).includes(donation_status as DonationStatus)
            ? await getUserDonationsWithStatus(donation_status as DonationStatus, user_email)
            : await getUserDonations(user_email);

        return NextResponse.json({ success: true, allDonations }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}