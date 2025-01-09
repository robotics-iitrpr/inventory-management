"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { Button } from "./ui/button";
import GetInventoryButton from "./getInventoryButton";

interface Props {
  email: String;
  admin: String;
}

const InventoryTable: React.FC<Props> = ({ email, admin }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch("/api/getInventory"); // Adjust API endpoint as necessary
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setInventory(data.inventory); // Use the `inventory` array from the response
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError("Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Table>
      <TableCaption>A list of your inventory.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Image</TableHead>
          <TableHead>Component</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>In Stock</TableHead>
          <TableHead>In Use</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {inventory.map((item: any) => (
          <TableRow key={item._id}>
            <TableCell className="w-[100px]">
              <img
                src={`https://utfs.io/f/${item.image}`}
                alt={item.component}
                className="w-10 h-10"
              />
            </TableCell>
            <TableCell className="font-medium w-[300px]">{item.component}</TableCell>
            <TableCell>{item.category}</TableCell>
            <TableCell>{item.inStock}</TableCell>
            <TableCell>{item.inUse}</TableCell>
            <TableCell className="text-right space-x-2">
              {email === admin ? (
                <div className="flex space-x-2 justify-end">
                  <Button>
                    <IconEdit />
                  </Button>
                  <Button className="bg-red-700">
                    <IconTrash />
                  </Button>
                </div>
              ) : (
                <GetInventoryButton component={item.component} inStock={item.inStock} image={item.image} />
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default InventoryTable;
