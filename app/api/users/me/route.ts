import {getDataFromToken} from "@/app/helpers/getdatafromtoken";

import { NextRequest, NextResponse } from "next/server";
import User from "@/app/models/userModel";
import { connect } from "@/app/dbconfig/dbconfig";

connect();

export async function GET(request:NextRequest){

    try {
        const userId = await getDataFromToken(request);
        const user = await User.findOne({_id: userId}).select("-password");
        return NextResponse.json({
            mesaaage: "User found",
            data: user
        })
    } catch (error:any) {
        return NextResponse.json({error: error.message}, {status: 400});
    }

}

export async function PUT(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        const updates = await request.json();
        const updated = await User.findByIdAndUpdate(userId, updates, {
            new: true,
            runValidators: true,
        }).select("-password");
        return NextResponse.json({ message: "User updated", data: updated });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const userId = getDataFromToken(request);
        await User.findByIdAndDelete(userId);
        return NextResponse.json({ message: "Account deleted" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}