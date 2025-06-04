import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getDonorID } from "@/lib/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getDonorID((await params).id);

        if (!user) {
            return NextResponse.json(
                { success: false, error: "Donor not found" },
                { status: 404 }
            );
        }

        const { password, ..._user } = user;
        return NextResponse.json({ success: true, user: _user }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "An error occurred: " + (error as Error).message },
            { status: 500 }
        );
    }
}
