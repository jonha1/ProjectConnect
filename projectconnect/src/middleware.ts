// This file helps route the user to login page if they aren't logged in when homepage loads
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest){
    // gets the next page
    const res = NextResponse.next();

    const supabase = createMiddlewareClient({req , res});

    // this will check if there is a session before the web app even loads
    const{
        data:{
            session
        }
    } = await supabase.auth.getSession(); //gets the current user session

    console.log(session);

    // if there is no session, redirect URL to login page
    if(!session){
        return NextResponse.rewrite(new URL('/login', req.url))
    }

    // if there is a session, return response
    return res;
};

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ]
}