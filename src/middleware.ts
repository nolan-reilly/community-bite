import { NextRequest, NextResponse } from "next/server";

function unauthorizedAccess(req: NextRequest){
  return NextResponse.redirect(new URL("/login", req.url), { status: 307 });
}

export async function middleware(req: NextRequest) {
  
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("auth failed--> No Bearer token found");
    return unauthorizedAccess(req);
  }

  const token = authHeader.split(" ")[1]; // Extract the token

  try {
    // Verify the token
    const verification = await fetch(`${req.nextUrl.origin}/api/auth`, {
      method: "POST",
      headers: {
        "Authorization": authHeader,
      }
    });

    if (!verification.ok) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { email, role } = await verification.json();

    // Role-based authentication
    const pathname = req.nextUrl.pathname;

    if (pathname.startsWith("/api/donor") && role !== "donor") {
      return NextResponse.json({ error: "Forbidden role access of donor by" + {role} }, { status: 403 });
    }
    if (pathname.startsWith("/api/food-bank") && role !== "food-bank") {
      return NextResponse.json({ error: "Forbidden role access of food-bank by" + {role} }, { status: 403 });
    }

    // Allow request to proceed
    console.log("API validation successful");
    return NextResponse.next();
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Invalid token", err_message: error }, { status: 403 });
  }
}

// Apply middleware to protected routes
export const config = {
  matcher: [ // Protect these API routes
    "/api/donor/:path*",
    "/api/food-bank/:path*",
  ],
};
