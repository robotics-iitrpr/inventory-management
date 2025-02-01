import client from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Requests");

    const requests = await collection.find({}).toArray();

    return NextResponse.json({ requests: requests });
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
    const collection = database.collection("Requests");
    const document = await req.json();
    const res = await collection.insertOne(document);
    return NextResponse.json(res);
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Requests");
    const document = await req.json();
    if (document.task === 0) {
      const result = await collection.updateOne(
        { _id: new ObjectId(document._id) },
        {
          $set: {
            status: document.status,
          },
        }
      );
    } else if (document.task === 1) {
      const result = await collection.updateOne(
        { _id: new ObjectId(document._id) },
        { $set: { returned: true, returnedProject: document.returnedProject } }
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

export async function DELETE(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Requests");

    const document = await req.json();
    // Deleting Request
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
