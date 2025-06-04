# Community Bite

### *Software Engineering II*: CS-442 @ UIC

- #### [Who was involved?](#collaborators)
- #### [How to run the project?](#running-the-project-locally)

## Description

Community Bite is a web-application that is designed to tackling hunger and food waste  
by bridging the gap between potential Donors and Food-Banks/Pantries. This is done by  
allowing Donors to make posts about the donations they want to make, of which Food-Banks  
can then request for these donations. This allows for a more seamless transition of  
potential donations to the food-banks, allowing for a more healthy cycle that benefits  
the community... hence Community Bite.  

On top of this, we integrated a Maps feature special for the community to use when looking  
for food they might need. Leveraging the ability for food-banks to use our app as an  
inventory management system, we can integrate inventories into our Maps to allow the  
community to search for items of need. But we cannot limit this to food-banks registered  
with our app, so we pull in all pantries in the area to the Maps since the main goal is  
to help the community.

## Tools Used

+ Next.js
  + React
  + Typescript
+ PostgreSQL
+ Prisma
+ Postman
+ Google Maps API
+ UI Libraries
  + Lucide
  + Tailwind
  + ShadCN
  + Radix

## Preview

![Homepage](./public/preview/home-page.png)
![Maps](./public/preview/maps-page.png)

## Collaborators

<u>Group that Coded/Created this Prototype (Spring '25):</u>

- [Martin Gawron](https://github.com/martingaw11) 
- [Nolan Reilly](https://github.com/nolan-reilly)
- [Micah Olugbamila](https://github.com/M-i-c-a-h)
- [Maryann Olugbamila](https://github.com/MaryannO45)

<u>Group that Originally Proposed the Project (Fall '23):</u>

- Sebastian B
- Aleksandr E
- Ronak C
- Yibin L

## Running the Project Locally

1. In terminal ```npm install```
2. Create postgres database  
  2.1. Add the database url to .env file as such: ```DATABASE_URL="postgresql://[user]:[password]@[port]/community_bite_db?schema=public"```  
  2.2 Run ```./runMigration.sh``` script  
  2.3 (Optional) Run ```./prismaSeed.sh``` script for seeding database  
3. Create a secret token for password/user hashing in .env file as such: ```JWT_SUPER_SECRET=[super-secret-hashing-string]```
4. Create a Google Maps API key for map integration  
  4.1 Go to [Google Cloud Console](https://console.cloud.google.com) and sign in  
  4.2 Create a New Project  
  4.3 In the "APIs & Services Section", go to Credentials and select your key  
  4.4 In key restrictions, select the following APIs that your key can access:  
    &ensp;&ensp;&ensp;&ensp; - Distance Matrix
    &ensp;&ensp;&ensp;&ensp; - Places API  
    &ensp;&ensp;&ensp;&ensp; - Places API (New)  
    &ensp;&ensp;&ensp;&ensp; - Maps Javascript API  
    &ensp;&ensp;&ensp;&ensp; - Geocoding API  
    &ensp;&ensp;&ensp;&ensp; - Geolocation API  
    &ensp;&ensp;&ensp;&ensp; - Maps Embed API  
    &ensp;&ensp;&ensp;&ensp; - Maps Static API  
  4.5 Add the key to the .env file: ```NEXT_PUBLIC_GOOGLE_KEY=[google-api-key]```  
5. Run ```npx next dev``` in terminal to start!

2.  **Set Up PostgreSQL Database:**
    * Create a PostgreSQL database.
    * Add the database connection URL to your `.env` file:
        ```
        DATABASE_URL="postgresql://[user]:[password]@[host]:[port]/community_bite_db"
        ```
        * Replace `[user]`, `[password]`, `[host]`, and `[port]` with your database credentials.
        * **Example:**
            ```
            DATABASE_URL="postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName"
            ```
    * Run database migrations:
        ```bash
        ./runMigration.sh
        ```
    * (Optional) Seed the database with initial data:
        ```bash
        ./prismaSeed.sh
        ```
    * View the live database:
        ```bash
        ./viewDB.sh
        ```

3.  **Configure JWT Secret:**
    * Generate a secure secret string for password/user hashing.
    * Add the secret to your `.env` file:
        ```
        JWT_SUPER_SECRET=[super-secret-hashing-string]
        ```

4.  **Obtain Google Maps API Key:**
    * Go to the [Google Cloud Console](https://console.cloud.google.com) and sign in.
    * Create a new project.
    * In the "APIs & Services" section, go to "Credentials" and create or select an API key.
    * Restrict the key to the following APIs:
        * Places API
        * Places API (New)
        * Maps JavaScript API
        * Geocoding API
        * Geolocation API
        * Maps Embed API
        * Maps Static API
    * Add the API key to your `.env` file:
        ```
        NEXT_PUBLIC_GOOGLE_KEY=[google-api-key]
        ```

5.  **Start the Development Server:**
    ```bash
    npx next dev
    ```

## Deployment on Vercel

The easiest way to deploy your Next.js application is using the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), provided by the creators of Next.js.

Refer to the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for comprehensive deployment instructions.
