import {connect} from "@/app/dbconfig/dbconfig";
import { NextResponse, NextRequest } from "next/server";
import user from "@/app/models/userModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const requestbody = await request.json();
        const {token} = requestbody;
        console.log(token);

        const usern = await user.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});
        if(!usern){
            return NextResponse.json({error: 'Invalid or expired token'}, {status: 400});
        }
        console.log(usern);
        usern.isVerified = true;
        usern.verifyToken = undefined;
        usern.verifyTokenExpiry = undefined;
        await usern.save();
        return NextResponse.json({message: 'Email verified successfully'}, {status: 200})



    }catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}