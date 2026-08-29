"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SearchHardwareForm() {
  const [minRam, setMinRam] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [category, setCategory] = useState("single-board-computer");

  const handleSearch = async () => {
    // We will wire this to mcpClient later
    console.log("Searching with", { minRam, maxPrice, category });
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single-board-computer">Single Board Computer</SelectItem>
              <SelectItem value="development-board">Development Board</SelectItem>
              <SelectItem value="compute-module">Compute Module</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="minRam">Min RAM (GB)</Label>
          <Input 
            id="minRam" 
            type="number" 
            placeholder="e.g. 8" 
            value={minRam} 
            onChange={(e) => setMinRam(e.target.value)} 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="maxPrice">Max Price ($)</Label>
          <Input 
            id="maxPrice" 
            type="number" 
            placeholder="e.g. 100" 
            value={maxPrice} 
            onChange={(e) => setMaxPrice(e.target.value)} 
          />
        </div>
      </div>
      <Button onClick={handleSearch} className="w-full">Search Hardware</Button>
    </div>
  );
}
