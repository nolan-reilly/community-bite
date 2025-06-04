import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { PrismaClient } from "@prisma/client";
import { Client, GeocodeRequest } from '@googlemaps/google-maps-services-js';

const prisma = new PrismaClient();
const geoClient = new Client({});

// POST /api/register/donor
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, businessName, email, password, address, streetAddress, city, state, zip, country } = body;

    // Check if email was provided
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    // Check if password was provided
    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }
    // Check if first/last name was provided
    if (!firstName || !lastName) {
      return NextResponse.json({ error: "First and last name are required" }, { status: 400 });
    }
    // Check if address was provided
    if (!address || !streetAddress || !city || !state || !zip || !country) {
      return NextResponse.json({ error: "Full address is required" }, { status: 400 });
    }

    // Check if email already exists as a donor
    const existingUser = await prisma.donor.findUnique({
      where: { email }
    });
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Check if email already exists as a business
    const _existingUser = await prisma.foodBank.findUnique({
      where: { email }
    });
    if (_existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }
    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Using geocoding get the user's longitude and latitude to store
    const geocodeRequest: GeocodeRequest = {
      params: {
        address: address,
        key: process.env.NEXT_PUBLIC_GOOGLE_KEY || ''
      },
      timeout: 1000 // milliseconds
    }

    let lat, lng = 0;
    try {
      const geocodeResponse = await geoClient.geocode(geocodeRequest);

      if (geocodeResponse.data.results.length > 0) {
        const location = geocodeResponse.data.results[0].geometry.location;
        lat = location.lat
        lng = location.lng
      }
      else {
        return NextResponse.json({ error: 'Address not found' }, { status: 404 });
      }
    }
    catch (error) {
      console.log('Geocoding error: ', error);
      return NextResponse.json({ error: 'Geocoding failed' }, { status: 500 });
    }

    const newAccount = await prisma.donor.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        email,
        zipcode: zip,
        city: city,
        street: streetAddress,
        state,
        country,
        password: passwordHash,
        address: address,
        latitude: lat,
        longitude: lng,
      }
    });
    
    return NextResponse.json({ message: "Donor registered successfully", account: newAccount }, { status: 201 });
  }
  catch (error) {
    return NextResponse.json({ error: "Error registering donor" }, { status: 400 });
  }
}
