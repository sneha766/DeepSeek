import connectDB from "@/config/db";
import Chat from "@/models/ChatData.models";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req){
    try {
        const {userId} = getAuth(req);

        if(!userId){
            return NextResponse.json({success : false,messagge : "user not authenticated"})
        }

        
        await connectDB();
        const data = await Chat.find({userId});
        return NextResponse.json({success:true,data});

        
    } catch (error) {
        return NextResponse.json({success : false,messagge : error.message})
    }
}