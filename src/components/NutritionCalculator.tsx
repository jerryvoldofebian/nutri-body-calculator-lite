import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Users, Clock, ChefHat } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Scale, Ruler } from "lucide-react";
import { calculateNutritionNeeds } from "../utils/nutritionCalculator";
import NutritionResults from "./NutritionResults";
import AverageNutritionCalculator from "./AverageNutritionCalculator";
import MealContributionCalculator from "./MealContributionCalculator";
import FoodNutritionCalculator from "./FoodNutritionCalculator";

const NutritionCalculator = () => {
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    age: ''
  });
  
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

    setIsCalculating(true);
    
    setTimeout(() => {
      const calculatedResults = calculateNutritionNeeds({
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age)
      });
      
      setResults(calculatedResults);
      setIsCalculating(false);
    }, 500);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Calculator className="text-blue-600" />
            Kalkulator Kebutuhan Gizi
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hitung kebutuhan harian energi, protein, lemak, karbohidrat, serat, dan air dengan berbagai metode perhitungan
          </p>
        </div>

        <Tabs defaultValue="individual" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Individual
            </TabsTrigger>
            <TabsTrigger value="average" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Rata-rata
            </TabsTrigger>
            <TabsTrigger value="meals" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Per Waktu Makan
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Gizi Makanan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Form Input */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Data Diri
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Masukkan data diri Anda untuk menghitung kebutuhan gizi
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
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
                      className="text-lg"
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
                      className="text-lg"
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
                      className="text-lg"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCalculate} 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      disabled={isCalculating}
                    >
                      {isCalculating ? 'Menghitung...' : 'Hitung Kebutuhan Gizi'}
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

              {/* Results */}
              <div>
                {results ? (
                  <NutritionResults results={results} />
                ) : (
                  <Card className="shadow-lg h-full flex items-center justify-center">
                    <CardContent className="text-center py-12">
                      <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-600 mb-2">
                        Hasil Perhitungan
                      </h3>
                      <p className="text-gray-500">
                        Lengkapi form di sebelah kiri untuk melihat kebutuhan gizi harian Anda
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="average">
            <AverageNutritionCalculator />
          </TabsContent>

          <TabsContent value="meals">
            <MealContributionCalculator />
          </TabsContent>

          <TabsContent value="food">
            <FoodNutritionCalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NutritionCalculator;
