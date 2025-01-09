import client from "@/lib/mongo";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Robotics");
    
    const inventory = await collection.find({}).toArray();

    return NextResponse.json({ inventory: inventory });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json({ message: "Something went wrong!" }, { status: 500 });
  }
}
