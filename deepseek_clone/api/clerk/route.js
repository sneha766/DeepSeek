import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User.model";

export async function POST(req){
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headerPayLoad = await headers();
    const svixHeaders = {
        "svix-id" : headerPayLoad.get("svix-id"),
        "svix-signature" : headerPayLoad.get("svix-signature")
    }
    
    const payload = await req.json();
    const body = JSON.stringify(payload);
    const {data,type} = wh.verify(body,svixHeaders)

    const userData = {
        _id: data.id,
        email : data.email_addresses[0].email_address,
        name : `${data.first_name} ${data.last_name}`,
        image : data.image.url,
    }

    await connectDB();
}