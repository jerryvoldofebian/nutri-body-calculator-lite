
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Users, Clock, ChefHat, UtensilsCrossed } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Scale, Ruler } from "lucide-react";
import { calculateNutritionNeeds, calculateAverageNutrition, calculateMealContribution } from "../utils/nutritionCalculator";
import NutritionResults from "./NutritionResults";
import AverageNutritionCalculator from "./AverageNutritionCalculator";
import MealContributionCalculator from "./MealContributionCalculator";
import FoodNutritionCalculator from "./FoodNutritionCalculator";
import MenuComposer from "./MenuComposer";

const NutritionCalculator = () => {
  const [formData, setFormData] = useState({
    gender: '',
    weight: '',
    height: '',
    age: ''
  });
  
  const [results, setResults] = useState(null);
  const [averageResults, setAverageResults] = useState(null);
  const [mealResults, setMealResults] = useState(null);
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
      // Individual calculation
      const individualResults = calculateNutritionNeeds({
        gender: formData.gender,
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        age: parseInt(formData.age)
      });
      
      // Average calculation
      const avgResults = calculateAverageNutrition(parseInt(formData.age));
      
      // Meal contribution calculation
      const mealContribution = calculateMealContribution(individualResults);
      
      setResults(individualResults);
      setAverageResults(avgResults);
      setMealResults({ nutritionNeeds: individualResults, mealContribution });
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
    setAverageResults(null);
    setMealResults(null);
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
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="individual" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Individual
            </TabsTrigger>
            <TabsTrigger value="food" className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              Gizi Makanan
            </TabsTrigger>
            <TabsTrigger value="menu" className="flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Susun Menu
            </TabsTrigger>
          </TabsList>

          <TabsContent value="individual">
            <div className="space-y-8">
              {/* Form Input */}
              <Card className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-green-600 text-white">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Data Diri
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Masukkan data diri Anda untuk menghitung kebutuhan gizi individual, rata-rata, dan kontribusi per waktu makan
                  </CardDescription>
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
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button 
                      onClick={handleCalculate} 
                      className="flex-1 bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                      disabled={isCalculating}
                    >
                      {isCalculating ? 'Menghitung...' : 'Hitung Semua Kebutuhan Gizi'}
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
              {results ? (
                <div className="space-y-8">
                  {/* Individual Results */}
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <User className="text-blue-600" />
                      Kebutuhan Gizi Individual
                    </h2>
                    <NutritionResults results={results} />
                  </div>

                  {/* Average Results */}
                  {averageResults && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="text-purple-600" />
                        Kebutuhan Gizi Rata-rata
                      </h2>
                      <NutritionResults results={averageResults} />
                    </div>
                  )}

                  {/* Meal Contribution Results */}
                  {mealResults && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Clock className="text-orange-600" />
                        Kontribusi Energi dan Gizi per Waktu Makan
                      </h2>
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
                                <span className="font-bold">{mealResults.mealContribution.energy.breakfast}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Siang (30%):</span>
                                <span className="font-bold">{mealResults.mealContribution.energy.lunch}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Malam (25%):</span>
                                <span className="font-bold">{mealResults.mealContribution.energy.dinner}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Pagi (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.energy.morningSnack}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Sore (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.energy.afternoonSnack}</span>
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
                                <span className="font-bold">{mealResults.mealContribution.protein.breakfast}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Siang (30%):</span>
                                <span className="font-bold">{mealResults.mealContribution.protein.lunch}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Malam (25%):</span>
                                <span className="font-bold">{mealResults.mealContribution.protein.dinner}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Pagi (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.protein.morningSnack}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Sore (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.protein.afternoonSnack}</span>
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
                                <span className="font-bold">{mealResults.mealContribution.carbohydrate.breakfast}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Siang (30%):</span>
                                <span className="font-bold">{mealResults.mealContribution.carbohydrate.lunch}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Malam (25%):</span>
                                <span className="font-bold">{mealResults.mealContribution.carbohydrate.dinner}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Pagi (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.carbohydrate.morningSnack}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Sore (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.carbohydrate.afternoonSnack}</span>
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
                                <span className="font-bold">{mealResults.mealContribution.water.breakfast}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Siang (30%):</span>
                                <span className="font-bold">{mealResults.mealContribution.water.lunch}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Makan Malam (25%):</span>
                                <span className="font-bold">{mealResults.mealContribution.water.dinner}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Pagi (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.water.morningSnack}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Snack Sore (10%):</span>
                                <span className="font-bold">{mealResults.mealContribution.water.afternoonSnack}</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="shadow-lg h-64 flex items-center justify-center">
                  <CardContent className="text-center py-12">
                    <Calculator className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      Hasil Perhitungan Lengkap
                    </h3>
                    <p className="text-gray-500">
                      Lengkapi form di atas untuk melihat kebutuhan gizi individual, rata-rata, dan kontribusi per waktu makan
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="food">
            <FoodNutritionCalculator />
          </TabsContent>

          <TabsContent value="menu">
            <MenuComposer />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NutritionCalculator;
