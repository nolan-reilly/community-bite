import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create Donors
  const donor1 = await prisma.donor.create({
    data: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      zipcode: "12345",
      city: "New York",
      street: "123 Main St",
      state: "NY",
      country: "USA",
      password: "1234",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const donor2 = await prisma.donor.create({
    data: {
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      zipcode: "54321",
      city: "Los Angeles",
      street: "456 Elm St",
      state: "CA",
      country: "USA",
      password: "1234",
      address: "",
      latitude: 0,
      longitude: 0,
    },
  });

  // Create Food Banks
  const foodBank1 = await prisma.foodBank.create({
    data: {
      business_name: "NYC Food Bank",
      email: "contact@nycfoodbank.org",
      zipcode: "10001",
      city: "New York",
      street: "789 Broadway",
      state: "NY",
      country: "USA",
      password: "1234",
    },
  });

  const foodBank2 = await prisma.foodBank.create({
    data: {
      business_name: "LA Food Pantry",
      email: "info@lafoodpantry.org",
      zipcode: "90001",
      city: "Los Angeles",
      street: "321 Sunset Blvd",
      state: "CA",
      country: "USA",
      password: "1234",
    },
  });

  // Create Inventory Items for Food Banks
  await prisma.inventory.createMany({
    data: [
      {
        business_id: foodBank1.business_id,
        produce_name: "Apples",
        quantity: 100,
      },
      {
        business_id: foodBank1.business_id,
        produce_name: "Bread",
        quantity: 50,
      },
      {
        business_id: foodBank2.business_id,
        produce_name: "Rice",
        quantity: 200,
      },
      {
        business_id: foodBank2.business_id,
        produce_name: "Beans",
        quantity: 150,
      },
    ],
  });

  // Create Donation Posts
  const donation1 = await prisma.donationPost.create({
    data: {
      donor_email: donor1.email,
      produce_name: "Oranges",
      quantity: 20,
      weight: 10,
      proposed_date: new Date("2024-06-15"),
      frequency: "Weekly",
      comment: "Fresh and organic oranges",
      donation_status: "OPEN",
    },
  });

  const donation2 = await prisma.donationPost.create({
    data: {
      donor_email: donor2.email,
      produce_name: "Carrots",
      quantity: 30,
      weight: 15,
      proposed_date: new Date("2024-06-20"),
      frequency: "One-time",
      comment: "Carrots packed and ready for pickup",
      donation_status: "OPEN",
    },
  });

  // Create Food Bank Donation Requests
  await prisma.foodBankDonationRequest.createMany({
    data: [
      {
        donation_id: donation1.post_id,
        business_id: foodBank1.business_id,
        request_status: "PENDING",
      },
      {
        donation_id: donation2.post_id,
        business_id: foodBank2.business_id,
        request_status: "ACCEPTED",
      },
    ],
  });

  // Create Local FoodBanks
  const churchBank1 = await prisma.foodBank.create({
    data: {
      business_name: "Annunciation of the Mother of God Pantry",
      email: "test@email.com",
      zipcode: "60491",
      city: "Homer Glen",
      street: "14610 S Will Cook Rd",
      state: "IL",
      country: "USA",
      password: "1234",
      address: "14610 S Will Cook Rd, Homer Glen, IL 60491",
      latitude: 41.623025,
      longitude: -87.912588 
    }
  });

  const churchBank2 = await prisma.foodBank.create({
    data: {
      business_name: "St Francis of Assisi Catholic Church Pantry",
      email: "test2@email.com",
      zipcode: "60467",
      city: "Orland Park",
      street: "15050 Wolf Rd",
      state: "IL",
      country: "USA",
      password: "1234",
      address: "15050 Wolf Rd, Orland Park, IL 60467",
      latitude: 41.616415,
      longitude: -87.893313
    }
  });

  // Inventory for Local FoodBanks
  await prisma.inventory.createMany({
    data: [
      {
        business_id: churchBank1.business_id,
        produce_name: "Apple",
        quantity: 25
      },
      {
        business_id: churchBank1.business_id,
        produce_name: "Orange",
        quantity: 15
      },
      {
        business_id: churchBank1.business_id,
        produce_name: "Banana",
        quantity: 50
      },
      {
        business_id: churchBank2.business_id,
        produce_name: "Orange",
        quantity: 20
      },
      {
        business_id: churchBank2.business_id,
        produce_name: "Lemon",
        quantity: 75
      },
      {
        business_id: churchBank2.business_id,
        produce_name: "Banana",
        quantity: 60
      }
    ]
  });

  console.log("✅ Seeding completed!");
}

// Execute the seed function
main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
