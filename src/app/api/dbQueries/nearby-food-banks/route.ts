import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const google_key = process.env.NEXT_PUBLIC_GOOGLE_KEY || '';

// GET api/dbQueries/nearby-food-banks
export async function POST(req: Request) {
  try {
    const { userLat, userLong, maxDist } = await req.json();
    
    if (!userLat || !userLong) {
      return NextResponse.json({ success: false, error: "User coordinates not specified" }, { status: 400 });
    }

    const radius = parseFloat(maxDist);
    const latitude = parseFloat(userLat);
    const longitude = parseFloat(userLong);
    if (isNaN(radius) || isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json({ success: false, error: "Invalid coordinates and/or distance"}, { status: 400 });
    }

    // Getting pantries from database
    const database_pantries = await prisma.foodBank.findMany();

    const nearby = database_pantries
      .map((p: any) => ({ 
        id: p.business_id,
        name: p.business_name,
        address: p.address,
        location: {latitude: p.latitude, longitude: p.longitude},
        mapsURL: `https://www.google.com/maps?q=${p.address}`
      }))
      .filter(p => haversineDistance(latitude, longitude, p.location.latitude, p.location.longitude) < radius); 
    
      const database_distances = await getTravelDistances(latitude, longitude, nearby);

    const nearby_database = await Promise.all(nearby
      .map(async (p: any, index: number) => ({
        ...p,
        distance: database_distances[index].distance,
        duration: database_distances[index].duration,
        inventory: await getBusinessInventory(p.id)
      }))
    ).then(result => result
      .filter(p => p.distance.value < radius*1000)
      .sort((a, b) => a.distance.value - b.distance.value)
    );

    // Getting pantries from a google search
    const google_pantries = await getGoogleNearbyPlaces(latitude, longitude, radius*1000); // radius: kilometers -> meters
    const google_distances = await getTravelDistances(latitude, longitude, google_pantries);

    const nearby_google = google_pantries
      .map((p: any, index: number) => ({
        id: p.id,
        name: p.displayName.text,
        address: p.formattedAddress,
        location: p.location,
        distance: google_distances[index].distance,
        duration: google_distances[index].duration,
        mapsURL: p.googleMapsUri,
        inventory: [] // no way for us to get their inventory
      }))
      .sort((a: any, b: any) => a.distance.value - b.distance.value);

    return NextResponse.json({ success: true, db_pantries: nearby_database, ggl_pantries: nearby_google }, {status: 200});
  }
  catch (error) {
    console.log((error as Error).message);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

async function getBusinessInventory(id: number) {
  const inventory = await prisma.inventory.findMany({
    where: {business_id: id}
  });

  return inventory;
}

async function getGoogleNearbyPlaces(lat: number, lng: number, rad: number): Promise<any> {
  const deltaLat: number = rad / 111000;
  const deltaLng: number = rad / (111000 * Math.cos((lat * Math.PI) / 180));
  
  const url = `https://places.googleapis.com/v1/places:searchText`
  
  const header = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': google_key,
    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri',
  }

  const reqBody = {
    'textQuery': 'food pantries near me',
    'pageSize': 5,
    'locationRestriction': {
      'rectangle': {
        'low': {
          'latitude': lat - deltaLat,
          'longitude': lng - deltaLng
        },
        'high': {
          'latitude': lat + deltaLat,
          'longitude': lng + deltaLng
        }
      }
    },
    'rankPreference': 'RELEVANCE'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: header,
      body: JSON.stringify(reqBody)
    });

    if (!response.ok) {
      const resMes = await response.json();
      console.log(resMes);
      console.log( Error("Error getting places from Google API"));
      return;
    }

    const data = await response.json();
    return data.places;
  }
  catch (error) {
    console.log("Error fetching nearby places: ", (error as Error).message);
    return;
  }
    
}

// Use google distance matrix api to get distances (approx. duration) to destinations
async function getTravelDistances(lat: number, lng: number, dest: any[]): Promise<any> {
  // default to empty array if there are no destinations to get distance to
  if (dest.length === 0) {
    return []
  }

  const destinations = dest.map((place) => `${place.location.latitude},${place.location.longitude}`);
  
  const params = {
    origins: `${lat},${lng}`,
    destinations: destinations.join('|'),
    units: 'imperial',
    key: google_key
  }
  
  const queryString = new URLSearchParams(params).toString();
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?${queryString}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.log( Error("Error getting distances from Google API"));
    return
  }

  const data = await response.json();
  console.log(data);
  return data.rows[0].elements;
}


// Trying not to use this anymore vvv
const KM_CONSTANT = 6371;

function haversineDistance(lat1: number, long1: number, lat2: number, long2: number): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  
  const dLat = toRad(lat2 - lat1);
  const dLong = toRad(long2 - long1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 -a));

  return KM_CONSTANT * c;
}
