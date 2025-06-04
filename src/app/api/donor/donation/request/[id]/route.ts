import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDonationPost, getBusinessID } from "@/lib/prisma";

const prisma = new PrismaClient();

// GET: api/donor/donation/request/[email_id]?post_id=123
export async function GET(req: Request, { params }: { params: Promise<{ id: string, post_id: string }> }) {
    try {
        const { searchParams } = new URL(req.url);
        const user_email = (await params).id;
        const post_id_str = searchParams.get("post_id");

        if (!post_id_str) {
            return NextResponse.json({ success: false, error: "post id is required" }, { status: 500 });
        }
        const post_id = parseInt(post_id_str);

        const donationRequests = await prisma.$queryRaw
                                            `
                                            SELECT FB.business_name, FB.email, 
                                                   FB.street || ' ' || FB.city || ',' || FB.state || ' ' || FB.zipcode as Address 
                                            FROM (SELECT * 
                                                  FROM "FoodBankDonationRequest" as FBDR
                                                  INNER JOIN "FoodBank" as fb
                                                  USING (business_id)
                                                  ) as FB
                                            INNER JOIN "DonationPost" as DP
                                            ON (FB.donation_id = DP.post_id)
                                            WHERE DP.donor_email = ${user_email} 
                                                AND DP.post_id = ${post_id} 
                                                AND FB.request_status = 'PENDING'
                                            `;

        return NextResponse.json({ success: true, donationRequests }, { status: 200 });
    } catch (error) {
        if (error instanceof Error) {
            return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        } else {
            return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
        }
    }
}

// PATCH: api/donor/donation/request/[email_id]
export async function PATCH(req: Request){
        try {
            const body = await req.json();
            const donationPost = await getDonationPost(parseInt((body.post_id)));
            const business = await getBusinessID(body.business_email);
            const req_status = body.request_status;

            if(!donationPost){
                return NextResponse.json({ success: false, error: "No such donation" }, { status: 500 });
            }
            if(!business){
                return NextResponse.json({ success: false, error: "No such food bank" }, { status: 500 });
            }
            
            if( req_status !== "ACCEPTED" && req_status !== "DECLINED"){
                return NextResponse.json(
                    { success: false, error: "Illegal request status "+ req_status }, { status: 500 })
            }

            const toUpdate = await prisma.$executeRaw
                                                `
                                                UPDATE "FoodBankDonationRequest"
                                                SET 
                                                    request_status = ${req_status}::"RequestStatus",
                                                    donation_status = 
                                                    CASE 
                                                        WHEN ${req_status} = 'DECLINED' 
                                                            OR ${donationPost.frequency} = 'one-time'
                                                            THEN 'CLOSE'
                                                        ELSE donation_status
                                                    END
                                                WHERE 
                                                    business_id = ${business.business_id} 
                                                    AND donation_id = ${donationPost.post_id}
                                                `;

            if (toUpdate !== 1) {
            console.log("toUpdate returned " + toUpdate);
            return NextResponse.json({ success: false, error: "update failed" }, { status: 500 });
            }
            
            return NextResponse.json({ success: true, message: "request updated" }, { status: 202 });
        } catch (error) {
            if (error instanceof Error) {
                return NextResponse.json({ success: false, error: error.message }, { status: 500 });
            } else {
                return NextResponse.json({ success: false, error: "Unknown error" }, { status: 500 });
            }
        }
}