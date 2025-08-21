import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import User from "@/models/User.model";

export async function POST(req) {
  try {
    console.log("📩 Incoming webhook...");

    const wh = new Webhook(process.env.SIGNING_SECRET);

    const headerPayload = headers();
    const svixHeaders = {
      "svix-id": headerPayload.get("svix-id"),
      "svix-signature": headerPayload.get("svix-signature"),
      "svix-timestamp": headerPayload.get("svix-timestamp"),
    };

    const payload = await req.json();
    const body = JSON.stringify(payload);

    console.log("🔐 Verifying webhook...");
    const { data, type } = wh.verify(body, svixHeaders);
    console.log("✅ Webhook verified:", type);

    const userData = {
      _id: data.id,
      email: data.email_addresses?.[0]?.email_address,
      name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
      image: data.image?.url,
    };

    console.log("⏳ Connecting to DB...");
    await connectDB();
    console.log("✅ DB Connected");

    switch (type) {
      case "user.created":
        await User.create(userData);
        console.log("👤 User created:", userData.email);
        break;

      case "user.updated":
        await User.findByIdAndUpdate(data.id, userData);
        console.log("✏️ User updated:", userData.email);
        break;

      case "user.deleted":
        await User.findByIdAndDelete(data.id);
        console.log("🗑️ User deleted:", data.id);
        break;

      default:
        console.log("ℹ️ Unhandled event type:", type);
        break;
    }

    return NextResponse.json({ message: "Event received" });
  } catch (err) {
    console.error("❌ Webhook error:", err.message || err);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 400 });
  }
}
