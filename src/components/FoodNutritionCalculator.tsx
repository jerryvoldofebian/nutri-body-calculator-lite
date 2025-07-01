
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
  otherAnimalProteinFoods,
  calculateNutritionPerServing,
  FoodItem,
  NutritionPer100g
} from "../utils/foodNutritionData";

const FoodNutritionCalculator = () => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [nutritionPer100g, setNutritionPer100g] = useState({
    energy: '',
    protein: '',
    fat: '',
    carbohydrate: '',
    fiber: ''
  });
  const [results, setResults] = useState<NutritionPer100g | null>(null);

  const foodCategories = {
    carbohydrate: { name: 'Sumber Karbohidrat', foods: carbohydrateFoods },
    plantProtein: { name: 'Protein Nabati', foods: plantProteinFoods },
    animalProtein: { name: 'Protein Hewani (Ikan Segar)', foods: animalProteinFoods },
    otherAnimalProtein: { name: 'Protein Hewani Lainnya', foods: otherAnimalProteinFoods }
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

  const handleNutritionChange = (field: string, value: string) => {
    setNutritionPer100g(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCalculate = () => {
    if (!selectedFood) {
      alert('Mohon pilih makanan terlebih dahulu');
      return;
    }

    const nutrition = {
      energy: parseFloat(nutritionPer100g.energy) || 0,
      protein: parseFloat(nutritionPer100g.protein) || 0,
      fat: parseFloat(nutritionPer100g.fat) || 0,
      carbohydrate: parseFloat(nutritionPer100g.carbohydrate) || 0,
      fiber: parseFloat(nutritionPer100g.fiber) || 0
    };

    const calculatedResults = calculateNutritionPerServing(selectedFood.weight, nutrition);
    setResults(calculatedResults);
  };

  const resetForm = () => {
    setSelectedCategory('');
    setSelectedFood(null);
    setNutritionPer100g({
      energy: '',
      protein: '',
      fat: '',
      carbohydrate: '',
      fiber: ''
    });
    setResults(null);
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Energi per 100g (kkal)</Label>
              <Input
                type="number"
                placeholder="Masukkan energi"
                value={nutritionPer100g.energy}
                onChange={(e) => handleNutritionChange('energy', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Protein per 100g (g)</Label>
              <Input
                type="number"
                placeholder="Masukkan protein"
                value={nutritionPer100g.protein}
                onChange={(e) => handleNutritionChange('protein', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Lemak per 100g (g)</Label>
              <Input
                type="number"
                placeholder="Masukkan lemak"
                value={nutritionPer100g.fat}
                onChange={(e) => handleNutritionChange('fat', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Karbohidrat per 100g (g)</Label>
              <Input
                type="number"
                placeholder="Masukkan karbohidrat"
                value={nutritionPer100g.carbohydrate}
                onChange={(e) => handleNutritionChange('carbohydrate', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Serat per 100g (g)</Label>
              <Input
                type="number"
                placeholder="Masukkan serat"
                value={nutritionPer100g.fiber}
                onChange={(e) => handleNutritionChange('fiber', e.target.value)}
              />
            </div>
          </div>

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
                    <strong>Rumus:</strong> (Takaran saji dalam gram ÷ 100 gram) × Nilai zat gizi per 100g
                  </p>
                  <p className="text-sm text-blue-600 mt-2">
                    ({selectedFood.weight}g ÷ 100g) × Nilai gizi per 100g
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
