import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const SUPER_SECRET = process.env.JWT_SUPER_SECRET || 'supersecret';

// api/auth
export async function POST(req: NextRequest) {
  const Authorization = req.headers.get('Authorization');

  if (!Authorization) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = Authorization.split(' ')[1];

  try {
    const {email, role} = jwt.verify(token, SUPER_SECRET) as {email: string, role: string};
    if (!email || !role) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({ email, role });
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
}