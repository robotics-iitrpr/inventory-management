import client from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Robotics");
    
    const document = await req.json();
    await collection.insertOne(document);
    return NextResponse.json({ "Result": "Success" });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
