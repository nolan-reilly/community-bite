import { PrismaClient } from "@prisma/client";
import * as prismaLib from "@/lib/prisma"; // all reuseable functions
import {
  Donor, 
  FoodBank,  
  Inventory, 
  DonationPost, 
  FoodBankDonationRequest, 
  RequestStatus, 
  DonationStatus 
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

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
  console.log("AllDonations");
  console.log(allDonations);
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })