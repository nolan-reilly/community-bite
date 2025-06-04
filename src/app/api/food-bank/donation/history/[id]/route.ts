import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET: api/food-bank/donation/history/[email_id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const email = (await params).id;
        const donationHistory = await prisma.$queryRaw
                                            `
                                            SELECT D.first_name || ' ' || D.last_name as donor_name, 
                                                   D.email as donor_email, D.zipcode as donor_zipcode,
                                                   DP.produce_name, DP.quantity, DP.weight, DP.proposed_date, DP.created_on,
                                                   DP.frequency, DP.comment, DP.post_id, FB.donation_status
                                            FROM (SELECT * 
                                                  FROM "FoodBankDonationRequest" as FBDR
                                                  INNER JOIN "FoodBank" as fb
                                                  USING (business_id)
                                                  ) as FB
                                            INNER JOIN "DonationPost" as DP
                                            ON (FB.donation_id = DP.post_id)
                                            INNER JOIN "Donor" as D
                                            ON (D.email = DP.donor_email)
                                            WHERE FB.email = ${email}
                                                AND FB.request_status = 'ACCEPTED'
                                            `;

        return NextResponse.json({ success: true, donationHistory }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}