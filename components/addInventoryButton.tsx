"use client";

import React, { useEffect } from "react";
import { IconPlus } from "@tabler/icons-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UploadButton } from "@/lib/utils/uploadthing";
import { useState } from "react";

const AddInventoryButton = () => {
  const [component, setComponent] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [imageName, setImageName] = useState("");

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only non-negative whole numbers
    const numericValue = Math.max(0, Math.floor(Number(value)));
    setQuantity(numericValue);
  };

  // Submit
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    if (component === "") return;

    fetch(`/api/addInventory`, {
      method: "POST",
      body: JSON.stringify({
        component: component,
        image: image,
        category: category,
        inStock: quantity,
        inUse: 0,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
  }, [submitting]);
  const handleSubmit = (e: any) => {
    if (!image) {
      alert("Please upload an image before submitting.");
      return;
    }
    setSubmitting(!submitting);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="float-right text-md font-bold">
          <IconPlus />
          Add Inventory
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Inventory</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Label className="text-lg font-bold">Image</Label>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res && res.length > 0) {
                  setImage(res[0].key);
                  setImageName(res[0].name);
                  alert("Upload Completed");
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
            {imageName && (
              <div style={{ marginTop: "10px" }} className="mb-2">
                <label>Uploaded Image:</label>
                <span style={{ marginLeft: "5px", fontWeight: "bold" }}>
                  {imageName}
                </span>
              </div>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-lg font-bold">
                Component
              </Label>
              <Input
                id="name"
                placeholder="Servo Motor"
                className="col-span-3"
                value={component}
                onChange={(e) => setComponent(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-lg font-bold">
                Category
              </Label>
              <Input
                id="name"
                placeholder="Robotic Arm Project"
                className="col-span-3"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="quantity"
                className="text-right text-lg font-bold"
              >
                Quantity
              </Label>
              <Input
                id="quantity"
                placeholder="2"
                className="col-span-3"
                type="number"
                step="1"
                value={quantity}
                onChange={handleQuantityChange}
                required
              />
            </div>
          </div>
          <Button type="submit">Add Inventory</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddInventoryButton;
