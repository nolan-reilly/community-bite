import { NextResponse } from "next/server";
import { DonationStatus, PrismaClient } from "@prisma/client";
import { getAllDonationsWithStatus } from "@/lib/prisma";

const prisma = new PrismaClient();

// GET: /api/dbQueries/donations/get-all-active/
export async function GET(){

    try{
        const allDonations = await prisma.$queryRaw
        `
        SELECT DP.produce_name, DP.quantity, DP.weight, DP.proposed_date, DP.created_on,
               DP.frequency, DP.comment, DP.post_id, DP.donor_email, 
               D.first_name || ' ' || D.last_name as donor_name
        FROM "DonationPost" as DP
        INNER JOIN "Donor" as D
        ON (D.email = DP.donor_email)
        WHERE DP.donation_status = 'OPEN'
        `;

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