
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChefHat } from "lucide-react";
import { 
  carbohydrateFoods, 
  plantProteinFoods, 
  animalProteinFoods,
  fatGroupAFoods,
  fatGroupBFoods,
  fatGroupCFoods,
  vegetableGroupBFoods,
  vegetableGroupCFoods,
  fruitFoods,
  nutritionStandards,
  calculateNutritionPerServing,
  FoodItem,
  NutritionPer100g
} from "../utils/foodNutritionData";

const FoodNutritionCalculator = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [results, setResults] = useState<NutritionPer100g | null>(null);

  const foodCategories = {
    carbohydrate: { name: 'Sumber Karbohidrat (Nasi)', foods: carbohydrateFoods },
    plantProtein: { name: 'Protein Nabati (Tempe)', foods: plantProteinFoods },
    animalProtein: { name: 'Protein Hewani (Ikan Segar)', foods: animalProteinFoods },
    fatGroupA: { name: 'Lemak Golongan A (Rendah Lemak)', foods: fatGroupAFoods },
    fatGroupB: { name: 'Lemak Golongan B (Sedang Lemak)', foods: fatGroupBFoods },
    fatGroupC: { name: 'Lemak Golongan C (Tinggi Lemak)', foods: fatGroupCFoods },
    vegetableGroupB: { name: 'Sayuran Golongan B', foods: vegetableGroupBFoods },
    vegetableGroupC: { name: 'Sayuran Golongan C', foods: vegetableGroupCFoods },
    fruit: { name: 'Buah-buahan (Pisang Ambon)', foods: fruitFoods }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedFood(null);
    setResults(null);
  };

  const handleFoodChange = (foodName: string) => {
    const foods = foodCategories[selectedCategory as keyof typeof foodCategories]?.foods || [];
    const food = foods.find(f => f.name === foodName);
    setSelectedFood(food || null);
    setResults(null);
  };

  const handleCalculate = () => {
    if (!selectedFood || !selectedCategory) {
      alert('Mohon pilih makanan terlebih dahulu');
      return;
    }

    const nutritionStandard = nutritionStandards[selectedCategory as keyof typeof nutritionStandards];
    if (!nutritionStandard) {
      alert('Kategori makanan tidak valid');
      return;
    }

    const calculatedResults = calculateNutritionPerServing(selectedFood.weight, nutritionStandard);
    setResults(calculatedResults);
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedFood(null);
    setResults(null);
  };

  const getNutritionStandard = () => {
    if (!selectedCategory) return null;
    return nutritionStandards[selectedCategory as keyof typeof nutritionStandards];
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <ChefHat className="h-5 w-5" />
            Perhitungan Kandungan Gizi per Sajian
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Kategori Makanan</Label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori makanan" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(foodCategories).map(([key, category]) => (
                    <SelectItem key={key} value={key}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Jenis Makanan</Label>
              <Select 
                value={selectedFood?.name || ''} 
                onValueChange={handleFoodChange}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis makanan" />
                </SelectTrigger>
                <SelectContent>
                  {selectedCategory && foodCategories[selectedCategory as keyof typeof foodCategories]?.foods.map((food) => (
                    <SelectItem key={food.name} value={food.name}>
                      {food.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedFood && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800 mb-2">Informasi Porsi:</h4>
              <p className="text-blue-700">
                <strong>{selectedFood.name}</strong> - {selectedFood.portion} ({selectedFood.weight}g)
              </p>
            </div>
          )}

          {selectedCategory && (
            <div className="p-4 bg-amber-50 rounded-lg">
              <h4 className="font-medium text-amber-800 mb-2">Standar Kandungan Gizi per 100g:</h4>
              {(() => {
                const standard = getNutritionStandard();
                return standard ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-amber-700">
                    <div>Energi: {standard.energy} kkal</div>
                    <div>Protein: {standard.protein} g</div>
                    <div>Lemak: {standard.fat} g</div>
                    <div>Karbohidrat: {standard.carbohydrate} g</div>
                    <div>Serat: {standard.fiber} g</div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={handleCalculate} 
              className="flex-1 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
              disabled={!selectedFood}
            >
              Hitung Kandungan Gizi
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

      {results && selectedFood && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
            <CardTitle>Hasil Perhitungan - {selectedFood.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Kandungan Gizi per Sajian ({selectedFood.weight}g):</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Energi:</span>
                    <span className="font-bold text-yellow-700">{results.energy} kkal</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">Protein:</span>
                    <span className="font-bold text-red-700">{results.protein} g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Lemak:</span>
                    <span className="font-bold text-orange-700">{results.fat} g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="font-medium">Karbohidrat:</span>
                    <span className="font-bold text-amber-700">{results.carbohydrate} g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Serat:</span>
                    <span className="font-bold text-green-700">{results.fiber} g</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Informasi Porsi:</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p><strong>Nama:</strong> {selectedFood.name}</p>
                  <p><strong>Takaran:</strong> {selectedFood.portion}</p>
                  <p><strong>Berat:</strong> {selectedFood.weight} gram</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Rumus:</strong> (Berat makanan penukar dalam gram ÷ 100 gram) × Nilai zat gizi standar per 100g
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    ({selectedFood.weight}g ÷ 100g) × Nilai gizi standar per 100g
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FoodNutritionCalculator;
