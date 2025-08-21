export const maxDuration = 60;
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Chat from "@/models/ChatData.models";
import connectDB from "@/config/db";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { chatId, prompt } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User not Authenticated" });
    }

    await connectDB();
    const data = await Chat.findOne({ userId, _id: chatId });

    if (!data) {
      return NextResponse.json({ success: false, message: "Chat not found" });
    }

    // ✅ Ensure messages array exists
    if (!Array.isArray(data.messages)) {
      data.messages = [];
    }

    const userPrompt = {
      role: "user",
      content: prompt,
      timestamp: Date.now(),
    };

    data.messages.push(userPrompt);

    // Call OpenRouter DeepSeek API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "My App",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-r1-0528:free",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const completion = await response.json();

    if (
      !completion.choices ||
      !completion.choices[0] ||
      !completion.choices[0].message
    ) {
      throw new Error("Invalid response from AI service");
    }

    const assistantMessage = {
      role: "assistant",
      content: completion.choices[0].message.content || "",
      timestamp: Date.now(),
    };

    data.messages.push(assistantMessage);
    await data.save();

    return NextResponse.json({
      success: true,
      data: assistantMessage,
    });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to get AI response",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
