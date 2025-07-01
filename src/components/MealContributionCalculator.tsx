
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User, Scale, Ruler } from "lucide-react";
import { calculateNutritionNeeds, calculateMealContribution } from "../utils/nutritionCalculator";

const MealContributionCalculator = () => {
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    age: ''
  });
  
  const [results, setResults] = useState(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    if (!formData.gender || !formData.weight || !formData.height || !formData.age) {
      alert('Mohon lengkapi semua data');
      return;
    }

    const nutritionNeeds = calculateNutritionNeeds({
      gender: formData.gender,
      weight: parseFloat(formData.weight),
      height: parseFloat(formData.height),
      age: parseInt(formData.age)
    });
    
    const mealContribution = calculateMealContribution(nutritionNeeds);
    setResults({ nutritionNeeds, mealContribution });
  };

  const resetForm = () => {
    setFormData({
      gender: '',
      weight: '',
      height: '',
      age: ''
    });
    setResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Kontribusi Energi per Waktu Makan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis kelamin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Umur (tahun)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Masukkan umur"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight" className="flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Berat Badan (kg)
              </Label>
              <Input
                id="weight"
                type="number"
                placeholder="Masukkan berat badan"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height" className="flex items-center gap-2">
                <Ruler className="h-4 w-4" />
                Tinggi Badan (cm)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="Masukkan tinggi badan"
                value={formData.height}
                onChange={(e) => handleInputChange('height', e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              onClick={handleCalculate} 
              className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
            >
              Hitung Kontribusi
            </Button>
            <Button 
              onClick={resetForm} 
              variant="outline"
              className="px-6"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Kontribusi Energi */}
          <Card className="shadow-lg">
            <CardHeader className="bg-yellow-500 text-white">
              <CardTitle>Kontribusi Energi (kkal)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sarapan (25%):</span>
                  <span className="font-bold">{results.mealContribution.energy.breakfast}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Siang (30%):</span>
                  <span className="font-bold">{results.mealContribution.energy.lunch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Malam (25%):</span>
                  <span className="font-bold">{results.mealContribution.energy.dinner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Pagi (10%):</span>
                  <span className="font-bold">{results.mealContribution.energy.morningSnack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Sore (10%):</span>
                  <span className="font-bold">{results.mealContribution.energy.afternoonSnack}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontribusi Protein */}
          <Card className="shadow-lg">
            <CardHeader className="bg-red-500 text-white">
              <CardTitle>Kontribusi Protein (g)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sarapan (25%):</span>
                  <span className="font-bold">{results.mealContribution.protein.breakfast}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Siang (30%):</span>
                  <span className="font-bold">{results.mealContribution.protein.lunch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Malam (25%):</span>
                  <span className="font-bold">{results.mealContribution.protein.dinner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Pagi (10%):</span>
                  <span className="font-bold">{results.mealContribution.protein.morningSnack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Sore (10%):</span>
                  <span className="font-bold">{results.mealContribution.protein.afternoonSnack}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontribusi Karbohidrat */}
          <Card className="shadow-lg">
            <CardHeader className="bg-amber-500 text-white">
              <CardTitle>Kontribusi Karbohidrat (g)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sarapan (25%):</span>
                  <span className="font-bold">{results.mealContribution.carbohydrate.breakfast}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Siang (30%):</span>
                  <span className="font-bold">{results.mealContribution.carbohydrate.lunch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Malam (25%):</span>
                  <span className="font-bold">{results.mealContribution.carbohydrate.dinner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Pagi (10%):</span>
                  <span className="font-bold">{results.mealContribution.carbohydrate.morningSnack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Sore (10%):</span>
                  <span className="font-bold">{results.mealContribution.carbohydrate.afternoonSnack}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Kontribusi Air */}
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-500 text-white">
              <CardTitle>Kontribusi Air (ml)</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Sarapan (25%):</span>
                  <span className="font-bold">{results.mealContribution.water.breakfast}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Siang (30%):</span>
                  <span className="font-bold">{results.mealContribution.water.lunch}</span>
                </div>
                <div className="flex justify-between">
                  <span>Makan Malam (25%):</span>
                  <span className="font-bold">{results.mealContribution.water.dinner}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Pagi (10%):</span>
                  <span className="font-bold">{results.mealContribution.water.morningSnack}</span>
                </div>
                <div className="flex justify-between">
                  <span>Snack Sore (10%):</span>
                  <span className="font-bold">{results.mealContribution.water.afternoonSnack}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MealContributionCalculator;
