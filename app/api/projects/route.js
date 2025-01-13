import client from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Projects");

    const projects = await collection.find({}).toArray();

    return NextResponse.json({ projects: projects });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Projects");
    const document = await req.json();
    await collection.insertOne(document);
    return NextResponse.json({ Result: "Success" });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Projects");
    const document = await req.json();
    const result = await collection.updateOne(
      { _id: new ObjectId(document._id) },
      { $set: { completed: true, endDate: new Date().toISOString() } }
    );

    return NextResponse.json({ message: "Successfull" }, { status: 200 });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Projects");
    const document = await req.json();
    // Deleting Inventory
    await collection.deleteOne({ _id: new ObjectId(document._id) });
    return NextResponse.json({ Result: "Success" });
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}
