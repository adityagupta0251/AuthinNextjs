import {connect} from "@/app/dbconfig/dbconfig";
import User from "@/app/models/userModel";
import {NextRequest, NextResponse} from "next/server";
import bcryptjs from "bcryptjs";
import jwt from 'jsonwebtoken';

connect()

export async function POST(request: NextRequest){
    try {
        // check if user exists
        const reqBody = await request.json();
        const {email, password} = reqBody;
        console.log(reqBody);

        const user = await User.findOne({email})
        if(!user){
            return NextResponse.json({error: "User doesn't exist"}, {status: 400});

        }
        // check if password is correct
        const validPassword = await bcryptjs.compare(password, user.password);
        if(!validPassword){
            return NextResponse.json({error: "Invaild password"}, {status: 400});



        }

        // create token data :
        const tokenData = {
            id: user.id,
            username: user.username,
            email: user.email

        }
        const token = await  jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: "1d"});

        const respone = NextResponse.json({
            message: 'User created successfully',
            success: true,

        });
        respone.cookies.set("token", token, {
            httpOnly: true,

        })
        return respone;







    }catch(error:any){
        return NextResponse.json({error: error.message}, {status:500});


    }
}

