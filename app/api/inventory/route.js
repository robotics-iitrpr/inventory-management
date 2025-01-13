import client from "@/lib/mongo";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const database = client.db("Inventory");
    const collection = database.collection("Robotics");

    const inventory = await collection.find({}).toArray();

    return NextResponse.json({ inventory: inventory });
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
    const collection = database.collection("Robotics");

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
    const collection = database.collection("Robotics");

    const document = await req.json();
    if (document.task === 0) {
      const result = await collection.updateOne(
        { _id: new ObjectId(document._id) },
        { $set: { inUse: document.quantity } }
      );
    } else if (document.task === 1) {
      const result = await collection.updateOne(
        { _id: new ObjectId(document._id) },
        {
          $set: {
            component: document.component,
            category: document.category,
            inStock: document.inStock,
          },
        }
      );
    } else if (document.task === 2) {
      const result = await collection.updateOne(
        { _id: new ObjectId(document._id) },
        {
          $inc: {
            inUse: -document.quantity,
          },
        }
      );
    }

    return NextResponse.json({ Result: "Success"}, {status: 200 });
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
    const collection = database.collection("Robotics");

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
