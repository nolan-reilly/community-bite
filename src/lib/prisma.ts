import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import { 
  Donor, 
  FoodBank,  
  Inventory, 
  DonationPost, 
  FoodBankDonationRequest, 
  RequestStatus, 
  DonationStatus 
  } from "@prisma/client";

// Define reusable functions
export async function getAllDonations() {
  return await prisma.donationPost.findMany();
}

export async function getAllDonationsWithStatus(status: DonationStatus) {
  return await prisma.donationPost.findMany({ where: { donation_status: status } });
}

export async function getAllDonationRequest() {
  return await prisma.foodBankDonationRequest.findMany();
}

export async function getAllDonationRequestWithStatus(status: RequestStatus) {
  return await prisma.foodBankDonationRequest.findMany( { where: { request_status: status } });
}

export async function getUserDonations(email: string) {
  return await prisma.donationPost.findMany({ where: { donor_email: email } });
}

export async function getUserDonationsWithStatus(status: DonationStatus, email: string) {
  return await prisma.donationPost.findMany(
    { 
      where: { donor_email: email ,
      donation_status: status
  } });
}

export async function getAllItemsInStore() {
  return await prisma.inventory.findMany();
}

export async function getDonorID(email: string): Promise<Donor | null> {
  return await prisma.donor.findUnique({ where: { email: email } });
}

export async function getBusinessID(email: string): Promise<FoodBank | null> {
  return await prisma.foodBank.findUnique({ where: { email: email } });
}

export async function getDonationPost(post_id: number){
  return await prisma.donationPost.findFirst( {where: { post_id: post_id } });
}

export async function getBFoodBankById(business_id: number){
  return await prisma.foodBank.findFirst( {where: {business_id: business_id } });
}

export async function getFoodBankDonationRequests(business_id: number) {
  return await prisma.foodBankDonationRequest.findMany( {where: { business_id: business_id}});
}

export async function getFoodBankDonationRequestsStatus(business_id: number, donation_id: number) {
  return await prisma.foodBankDonationRequest.findUnique({
    where: {
      requestKey: {
        business_id: business_id,
        donation_id: donation_id
      }
    }
  });
}

export async function getRequestsByPostId(post_id: number){
  return await prisma.foodBankDonationRequest.findMany( {where: { donation_id: post_id } });
}