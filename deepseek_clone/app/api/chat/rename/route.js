import connectDB from "@/config/db";
import Chat from "@/models/ChatData.models";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req){
    try {
        const {userId} = getAuth(req);

        if(!userId){
            return NextResponse.json({success : false,messagge : "user not authenticated"})
        }
        
        const {chatId,name} = await req.json();
        
        await connectDB();
        await Chat.findOneAndUpdate({_id :chatId,userId},{name});
        return NextResponse.json({success:true,message :"Chat Renamed"});

        
    } catch (error) {
        return NextResponse.json({success : false,messagge : error.message})
    }
}