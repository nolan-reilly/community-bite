import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getBusinessID } from "@/lib/prisma";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getBusinessID((await params).id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: "Food bank not found" },
                { status: 404 }
            );
        }

        const { password, ..._user } = user;
        return NextResponse.json({ success: true, user: _user }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "An error occurred" },
            { status: 500 }
        );
    }
}