import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';

export default async function middlware(request: NextRequest) {
  // console.log('미들웨어 호출', request.nextUrl.href);
  const session = await auth();

  console.log(session);

  if (!session?.user) {
    return NextResponse.redirect(`${request.nextUrl.origin}/login`);
  }
}

export const config = {
  matcher: ['/profile', '/plant'],
};
