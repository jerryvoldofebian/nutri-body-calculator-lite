
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator } from "lucide-react";
import { calculateAverageNutrition } from "../utils/nutritionCalculator";
import NutritionResults from "./NutritionResults";

const AverageNutritionCalculator = () => {
  const [age, setAge] = useState('');
  const [results, setResults] = useState(null);

  const handleCalculate = () => {
    if (!age || isNaN(parseInt(age))) {
      alert('Mohon masukkan umur yang valid');
      return;
    }

    const calculatedResults = calculateAverageNutrition(parseInt(age));
    setResults(calculatedResults);
  };

  const resetForm = () => {
    setAge('');
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Perhitungan Rata-rata Kebutuhan Gizi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="age">Umur (tahun)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Masukkan umur"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="text-lg"
              />
            </div>
            
            <div className="flex gap-3">
              <Button 
                onClick={handleCalculate} 
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                Hitung Rata-rata
              </Button>
              <Button 
                onClick={resetForm} 
                variant="outline"
                className="px-6"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && <NutritionResults results={results} />}
    </div>
  );
};

export default AverageNutritionCalculator;
