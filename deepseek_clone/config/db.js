import mongoose from "mongoose";

let cached = global.mongoose || { conn: null, promise: null };

export default async function connectDB() {
    if (cached.conn) {
        console.log("✅ Using cached MongoDB connection");
        return cached.conn;
    }

    if (!cached.promise) {
        console.log("⏳ Connecting to MongoDB...");
        cached.promise = mongoose
            .connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then((mongoose) => {
                console.log("✅ MongoDB connection established");
                return mongoose;
            })
            .catch((err) => {
                console.error("❌ Error in mongoose.connect:", err);
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        console.error("❌ Error connecting to DB:", error);
    }

    return cached.conn;
}
