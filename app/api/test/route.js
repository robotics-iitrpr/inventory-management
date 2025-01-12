

  import client from "@/lib/mongo";
  import { ObjectId } from "mongodb";
  import { NextResponse } from "next/server";
  
  export async function PUT(req) {
    try {
      const database = client.db("Inventory");
      const collection = database.collection("Requests");
      const result = await collection.updateMany(
        {},
        { $set: { "returned": false } }
      );
  
      if (result.matchedCount === 0) {
        return NextResponse.json(
          { message: `Request not found with id:${document._id}` },
          { status: 404 }
        );
      }
  
      return NextResponse.json({ message: "Successfull" }, { status: 200 });
    } catch (error) {
      console.error("Error updating status:", error);
      return NextResponse.json(
        { message: "Something went wrong!" },
        { status: 500 }
      );
    }
  }
  