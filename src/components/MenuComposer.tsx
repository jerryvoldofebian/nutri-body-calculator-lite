import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, UtensilsCrossed, Info, Target, Clock } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  FoodItem
} from "../utils/foodNutritionData";
import { calculateMealContribution, calculateCustomAgeRangeNutrition } from "../utils/nutritionCalculator";

interface MenuNutrition {
  energy: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
}

interface MenuItem {
  id: string;
  category: string;
  food: FoodItem;
  actualWeight: number;
  nutrition: MenuNutrition;
}

interface ToleranceRange {
  min: number;
  max: number;
}

const MenuComposer = () => {
  const [menuName, setMenuName] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [actualWeight, setActualWeight] = useState<number>(0);
  
  // Custom age range targeting
  const [startAge, setStartAge] = useState<number>(7);
  const [endAge, setEndAge] = useState<number>(12);
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);
  
  // Meal type selection
  const [selectedMealType, setSelectedMealType] = useState<string>('');

  const foodCategories = {
    carbohydrate: { name: 'Sumber Karbohidrat', foods: carbohydrateFoods },
    plantProtein: { name: 'Protein Nabati', foods: plantProteinFoods },
    animalProtein: { name: 'Protein Hewani', foods: animalProteinFoods },
    fatGroupA: { name: 'Lemak Golongan A', foods: fatGroupAFoods },
    fatGroupB: { name: 'Lemak Golongan B', foods: fatGroupBFoods },
    fatGroupC: { name: 'Lemak Golongan C', foods: fatGroupCFoods },
    vegetableGroupB: { name: 'Sayuran Golongan B', foods: vegetableGroupBFoods },
    vegetableGroupC: { name: 'Sayuran Golongan C', foods: vegetableGroupCFoods },
    fruit: { name: 'Buah-buahan', foods: fruitFoods }
  };

  const mealTypes = {
    breakfast: { name: 'Sarapan', percentage: 25 },
    lunch: { name: 'Makan Siang', percentage: 30 },
    dinner: { name: 'Makan Malam', percentage: 25 }
  };

  // Get nutrition targets for custom age range
  const getNutritionTargets = () => {
    return calculateCustomAgeRangeNutrition(startAge, endAge);
  };

  const targets = getNutritionTargets();
  const mealContributions = calculateMealContribution(targets);

  // Calculate tolerance range (80% - 120%)
  const getToleranceRange = (value: number): ToleranceRange => ({
    min: Math.round(value * 0.8),
    max: Math.round(value * 1.2)
  });

  const toleranceRanges = {
    energy: getToleranceRange(targets.energy),
    protein: getToleranceRange(targets.protein),
    fat: getToleranceRange(targets.fat.total),
    carbohydrate: getToleranceRange(targets.carbohydrate)
  };

  // Get meal-specific targets and tolerance ranges
  const getMealTargets = (mealType: string) => {
    const percentage = mealTypes[mealType as keyof typeof mealTypes]?.percentage || 25;
    return {
      energy: Math.round(targets.energy * percentage / 100),
      protein: Math.round(targets.protein * percentage / 100),
      fat: Math.round(targets.fat.total * percentage / 100),
      carbohydrate: Math.round(targets.carbohydrate * percentage / 100)
    };
  };

  const getMealToleranceRanges = (mealType: string) => {
    const mealTargets = getMealTargets(mealType);
    return {
      energy: getToleranceRange(mealTargets.energy),
      protein: getToleranceRange(mealTargets.protein),
      fat: getToleranceRange(mealTargets.fat),
      carbohydrate: getToleranceRange(mealTargets.carbohydrate)
    };
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedFood(null);
    setActualWeight(0);
  };

  const handleFoodChange = (foodName: string) => {
    const foods = foodCategories[selectedCategory as keyof typeof foodCategories]?.foods || [];
    const food = foods.find(f => f.name === foodName);
    setSelectedFood(food || null);
    setActualWeight(food?.weight || 0);
  };

  const addMenuItem = () => {
    if (!selectedFood || !selectedCategory || actualWeight <= 0) {
      alert('Mohon pilih makanan dan masukkan berat terlebih dahulu');
      return;
    }

    const nutritionStandard = nutritionStandards[selectedCategory as keyof typeof nutritionStandards];
    if (!nutritionStandard) {
      alert('Kategori makanan tidak valid');
      return;
    }

    const calculatedNutrition = calculateNutritionPerServing(
      actualWeight, 
      nutritionStandard.standardWeight, 
      nutritionStandard
    );

    const newMenuItem: MenuItem = {
      id: Date.now().toString(),
      category: selectedCategory,
      food: selectedFood,
      actualWeight: actualWeight,
      nutrition: calculatedNutrition
    };

    setMenuItems([...menuItems, newMenuItem]);
    setSelectedCategory('');
    setSelectedFood(null);
    setActualWeight(0);
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const calculateTotalNutrition = (): MenuNutrition => {
    return menuItems.reduce((total, item) => ({
      energy: total.energy + item.nutrition.energy,
      protein: Math.round((total.protein + item.nutrition.protein) * 10) / 10,
      fat: Math.round((total.fat + item.nutrition.fat) * 10) / 10,
      carbohydrate: Math.round((total.carbohydrate + item.nutrition.carbohydrate) * 10) / 10,
      fiber: Math.round((total.fiber + item.nutrition.fiber) * 10) / 10
    }), { energy: 0, protein: 0, fat: 0, carbohydrate: 0, fiber: 0 });
  };

  const resetMenu = () => {
    setMenuName('');
    setMenuItems([]);
    setSelectedCategory('');
    setSelectedFood(null);
    setActualWeight(0);
    setSelectedMealType('');
  };

  const getCategoryDisplayName = (category: string) => {
    return foodCategories[category as keyof typeof foodCategories]?.name || category;
  };

  const totalNutrition = calculateTotalNutrition();

  // Calculate percentage achievement
  const getAchievementPercentage = (actual: number, target: number) => {
    return Math.round((actual / target) * 100);
  };

  // Check if nutrition is within tolerance (80% - 120%)
  const isWithinTolerance = (actual: number, range: ToleranceRange) => {
    return actual >= range.min && actual <= range.max;
  };

  // Get status based on tolerance
  const getNutritionStatus = (actual: number, range: ToleranceRange) => {
    if (actual < range.min) return { status: 'kurang', color: 'red' };
    if (actual > range.max) return { status: 'berlebih', color: 'orange' };
    return { status: 'sesuai', color: 'green' };
  };

  return (
    <div className="space-y-6">
      {/* Custom Age Range Target Selection */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Target Rentang Umur Kustom
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Umur Mulai (tahun)</Label>
                <Input
                  type="number"
                  value={startAge}
                  onChange={(e) => setStartAge(Number(e.target.value))}
                  min="0"
                  max="100"
                  placeholder="Contoh: 7"
                />
              </div>
              <div className="space-y-2">
                <Label>Umur Akhir (tahun)</Label>
                <Input
                  type="number"
                  value={endAge}
                  onChange={(e) => setEndAge(Number(e.target.value))}
                  min="0"
                  max="100"
                  placeholder="Contoh: 12"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">
              Target Kebutuhan Gizi Harian:
              <span className="text-sm font-normal"> (Rata-rata Rentang Umur {startAge}-{endAge} tahun)</span>
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><strong>Energi:</strong> {targets.energy} kkal</div>
              <div><strong>Protein:</strong> {targets.protein} g</div>
              <div><strong>Lemak:</strong> {targets.fat.total} g</div>
              <div><strong>Karbohidrat:</strong> {targets.carbohydrate} g</div>
            </div>
            <div className="mt-3 p-3 bg-purple-100 rounded">
              <h5 className="font-medium text-purple-800 text-sm mb-2">Rentang Toleransi (80% - 120%):</h5>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                <div><strong>Energi:</strong> {toleranceRanges.energy.min} - {toleranceRanges.energy.max} kkal</div>
                <div><strong>Protein:</strong> {toleranceRanges.protein.min} - {toleranceRanges.protein.max} g</div>
                <div><strong>Lemak:</strong> {toleranceRanges.fat.min} - {toleranceRanges.fat.max} g</div>
                <div><strong>Karbo:</strong> {toleranceRanges.carbohydrate.min} - {toleranceRanges.carbohydrate.max} g</div>
              </div>
            </div>
            <div className="mt-2 text-xs text-purple-600">
              <strong>Kategori:</strong> {targets.category}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meal Distribution Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Distribusi Kebutuhan Gizi per Waktu Makan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {Object.entries(mealTypes).map(([key, meal]) => {
              const mealTargets = getMealTargets(key);
              const mealTolerances = getMealToleranceRanges(key);
              
              return (
                <div key={key} className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">
                    {meal.name} ({meal.percentage}%)
                  </h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Energi:</strong> {mealTargets.energy} kkal</div>
                    <div><strong>Protein:</strong> {mealTargets.protein} g</div>
                    <div><strong>Lemak:</strong> {mealTargets.fat} g</div>
                    <div><strong>Karbohidrat:</strong> {mealTargets.carbohydrate} g</div>
                  </div>
                  <div className="mt-3 p-2 bg-green-100 rounded text-xs">
                    <div className="font-medium text-green-800 mb-1">Toleransi (80%-120%):</div>
                    <div>E: {mealTolerances.energy.min}-{mealTolerances.energy.max} kkal</div>
                    <div>P: {mealTolerances.protein.min}-{mealTolerances.protein.max} g</div>
                    <div>L: {mealTolerances.fat.min}-{mealTolerances.fat.max} g</div>
                    <div>K: {mealTolerances.carbohydrate.min}-{mealTolerances.carbohydrate.max} g</div>
                  </div>
                </div>
              );
            })}
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <strong>Distribusi Waktu Makan:</strong> Sarapan 25%, Makan Siang 30%, Makan Malam 25%, Camilan Pagi 10%, Camilan Sore 10%
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Calculation Information */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Informasi Cara Perhitungan
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowCalculationInfo(!showCalculationInfo)}
              className="text-white hover:bg-white/20"
            >
              {showCalculationInfo ? 'Sembunyikan' : 'Tampilkan'}
            </Button>
          </CardTitle>
        </CardHeader>
        {showCalculationInfo && (
          <CardContent className="p-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-3">
                  <p><strong>Rumus Perhitungan Gizi:</strong></p>
                  <p className="bg-blue-50 p-3 rounded">
                    <code>(Berat Aktual Makanan Penukar ÷ Berat Standar Makanan Penukar) × Nilai Zat Gizi Standar</code>
                  </p>
                  <p><strong>Contoh:</strong></p>
                  <p>Bihun 10 gram → Energi: (10 ÷ 50) × 175 kkal = 35 kkal</p>
                  
                  <div className="mt-4 p-3 bg-yellow-50 rounded">
                    <p><strong>Perhitungan Target Kebutuhan Gizi Rentang Umur Kustom:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li><strong>Rentang Umur Kustom:</strong> Menghitung rata-rata kebutuhan gizi dari semua kelompok umur yang tercakup dalam rentang yang ditentukan</li>
                      <li><strong>Contoh:</strong> Rentang 7-12 tahun mencakup kelompok 7-9 tahun dan 10-12 tahun</li>
                      <li><strong>Perhitungan:</strong> Rata-rata nilai gizi laki-laki dan perempuan untuk setiap kelompok, kemudian rata-rata antar kelompok</li>
                      <li><strong>Hasil:</strong> Target gizi yang mewakili kebutuhan rata-rata untuk seluruh rentang umur yang dipilih</li>
                    </ul>
                  </div>

                  <div className="mt-4 p-3 bg-green-50 rounded">
                    <p><strong>Toleransi Kebutuhan Gizi:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li><strong>Rentang Normal:</strong> 80% - 120% dari kebutuhan harian/per waktu makan</li>
                      <li><strong>Status Kurang:</strong> {'< 80%'} dari kebutuhan</li>
                      <li><strong>Status Sesuai:</strong> 80% - 120% dari kebutuhan</li>
                      <li><strong>Status Berlebih:</strong> {'> 120%'} dari kebutuhan</li>
                    </ul>
                  </div>

                  <div className="mt-4 p-3 bg-orange-50 rounded">
                    <p><strong>Distribusi Waktu Makan:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li><strong>Sarapan:</strong> 25% dari kebutuhan harian</li>
                      <li><strong>Makan Siang:</strong> 30% dari kebutuhan harian</li>
                      <li><strong>Makan Malam:</strong> 25% dari kebutuhan harian</li>
                      <li><strong>Camilan Pagi:</strong> 10% dari kebutuhan harian</li>
                      <li><strong>Camilan Sore:</strong> 10% dari kebutuhan harian</li>
                    </ul>
                  </div>

                  <p><strong>Standar Gizi per Kategori:</strong></p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li><strong>Karbohidrat (100g nasi):</strong> 175 kkal, 4g protein, 40g karbohidrat</li>
                    <li><strong>Protein Nabati (50g tempe):</strong> 80 kkal, 6g protein, 3g lemak, 8g karbohidrat</li>
                    <li><strong>Protein Hewani (40g ikan):</strong> 50 kkal, 7g protein, 2g lemak</li>
                    <li><strong>Lemak Gol. A (100g):</strong> 50 kkal, 7g protein, 2g lemak</li>
                    <li><strong>Lemak Gol. B (100g):</strong> 75 kkal, 7g protein, 5g lemak</li>
                    <li><strong>Lemak Gol. C (100g):</strong> 150 kkal, 7g protein, 13g lemak</li>
                    <li><strong>Sayuran Gol. B (100g):</strong> 25 kkal, 1g protein, 5g karbohidrat</li>
                    <li><strong>Sayuran Gol. C (100g):</strong> 50 kkal, 3g protein, 10g karbohidrat</li>
                    <li><strong>Buah-buahan (100g):</strong> 50 kkal, 10g karbohidrat</li>
                  </ul>
                </div>
              </AlertDescription>
            </Alert>
          </CardContent>
        )}
      </Card>

      {/* Menu Composer */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5" />
            Penyusun Menu Makanan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nama Menu</Label>
              <Input
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="Masukkan nama menu (contoh: Menu Sarapan, Menu Makan Siang)"
              />
            </div>
            <div className="space-y-2">
              <Label>Waktu Makan</Label>
              <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih waktu makan" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(mealTypes).map(([key, meal]) => (
                    <SelectItem key={key} value={key}>
                      {meal.name} ({meal.percentage}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Kategori Makanan</Label>
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
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
                  <SelectValue placeholder="Pilih makanan" />
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

            <div className="space-y-2">
              <Label>Berat Aktual (gram)</Label>
              <Input
                type="number"
                value={actualWeight}
                onChange={(e) => setActualWeight(Number(e.target.value))}
                placeholder="Berat dalam gram"
                min="0"
                step="0.1"
              />
            </div>
          </div>

          {selectedFood && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-700">
                <strong>{selectedFood.name}</strong> - {selectedFood.portion} (Standar: {selectedFood.weight}g)
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={addMenuItem}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700"
              disabled={!selectedFood || actualWeight <= 0}
            >
              <Plus className="h-4 w-4" />
              Tambah ke Menu
            </Button>
            <Button 
              onClick={resetMenu}
              variant="outline"
            >
              Reset Menu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Menu Results */}
      {menuItems.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <CardTitle>
              {menuName || 'Menu Makanan'} - Komposisi Menu
              {selectedMealType && (
                <span className="text-sm font-normal ml-2">
                  ({mealTypes[selectedMealType as keyof typeof mealTypes]?.name})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Makanan</TableHead>
                    <TableHead>Berat (g)</TableHead>
                    <TableHead>Energi (kkal)</TableHead>
                    <TableHead>Protein (g)</TableHead>
                    <TableHead>Lemak (g)</TableHead>
                    <TableHead>Karbo (g)</TableHead>
                    <TableHead>Serat (g)</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {menuItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {getCategoryDisplayName(item.category)}
                      </TableCell>
                      <TableCell>{item.food.name}</TableCell>
                      <TableCell>{item.actualWeight}</TableCell>
                      <TableCell>{item.nutrition.energy}</TableCell>
                      <TableCell>{item.nutrition.protein}</TableCell>
                      <TableCell>{item.nutrition.fat}</TableCell>
                      <TableCell>{item.nutrition.carbohydrate}</TableCell>
                      <TableCell>{item.nutrition.fiber}</TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeMenuItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-green-50 font-bold">
                    <TableCell colSpan={3}>TOTAL GIZI MENU</TableCell>
                    <TableCell>{totalNutrition.energy}</TableCell>
                    <TableCell>{totalNutrition.protein}</TableCell>
                    <TableCell>{totalNutrition.fat}</TableCell>
                    <TableCell>{totalNutrition.carbohydrate}</TableCell>
                    <TableCell>{totalNutrition.fiber}</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6">
              {/* Daily Nutrition Achievement vs Target */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Pencapaian vs Target Gizi Harian (dengan Toleransi)</h4>
                <div className="text-xs text-gray-600 mb-3">
                  Target berdasarkan: Rata-rata rentang umur {startAge}-{endAge} tahun
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: 'Energi', actual: totalNutrition.energy, target: targets.energy, range: toleranceRanges.energy, unit: 'kkal' },
                    { name: 'Protein', actual: totalNutrition.protein, target: targets.protein, range: toleranceRanges.protein, unit: 'g' },
                    { name: 'Lemak', actual: totalNutrition.fat, target: targets.fat.total, range: toleranceRanges.fat, unit: 'g' },
                    { name: 'Karbohidrat', actual: totalNutrition.carbohydrate, target: targets.carbohydrate, range: toleranceRanges.carbohydrate, unit: 'g' }
                  ].map(item => {
                    const status = getNutritionStatus(item.actual, item.range);
                    return (
                      <div key={item.name} className={`p-3 rounded-lg ${
                        status.color === 'green' ? 'bg-green-50' :
                        status.color === 'red' ? 'bg-red-50' : 'bg-orange-50'
                      }`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium">{item.name}:</span>
                          <span className={`font-bold ${
                            status.color === 'green' ? 'text-green-700' :
                            status.color === 'red' ? 'text-red-700' : 'text-orange-700'
                          }`}>
                            {item.actual} / {item.target} {item.unit}
                          </span>
                        </div>
                        <div className="text-xs mb-2">
                          Toleransi: {item.range.min} - {item.range.max} {item.unit}
                        </div>
                        <div className={`w-full rounded-full h-2 ${
                          status.color === 'green' ? 'bg-green-200' :
                          status.color === 'red' ? 'bg-red-200' : 'bg-orange-200'
                        }`}>
                          <div 
                            className={`h-2 rounded-full ${
                              status.color === 'green' ? 'bg-green-600' :
                              status.color === 'red' ? 'bg-red-600' : 'bg-orange-600'
                            }`}
                            style={{ width: `${Math.min(getAchievementPercentage(item.actual, item.target), 100)}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs mt-1">
                          <span className={`${
                            status.color === 'green' ? 'text-green-600' :
                            status.color === 'red' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {getAchievementPercentage(item.actual, item.target)}% dari target
                          </span>
                          <span className={`font-medium ${
                            status.color === 'green' ? 'text-green-700' :
                            status.color === 'red' ? 'text-red-700' : 'text-orange-700'
                          }`}>
                            Status: {status.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Meal-Specific Nutrition Achievement */}
              {selectedMealType && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">
                    Pencapaian vs Target Gizi {mealTypes[selectedMealType as keyof typeof mealTypes]?.name} 
                    <span className="text-sm font-normal"> ({mealTypes[selectedMealType as keyof typeof mealTypes]?.percentage}% dari kebutuhan harian)</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { 
                        name: 'Energi', 
                        actual: totalNutrition.energy, 
                        target: getMealTargets(selectedMealType).energy, 
                        range: getMealToleranceRanges(selectedMealType).energy, 
                        unit: 'kkal' 
                      },
                      { 
                        name: 'Protein', 
                        actual: totalNutrition.protein, 
                        target: getMealTargets(selectedMealType).protein, 
                        range: getMealToleranceRanges(selectedMealType).protein, 
                        unit: 'g' 
                      },
                      { 
                        name: 'Lemak', 
                        actual: totalNutrition.fat, 
                        target: getMealTargets(selectedMealType).fat, 
                        range: getMealToleranceRanges(selectedMealType).fat, 
                        unit: 'g' 
                      },
                      { 
                        name: 'Karbohidrat', 
                        actual: totalNutrition.carbohydrate, 
                        target: getMealTargets(selectedMealType).carbohydrate, 
                        range: getMealToleranceRanges(selectedMealType).carbohydrate, 
                        unit: 'g' 
                      }
                    ].map(item => {
                      const status = getNutritionStatus(item.actual, item.range);
                      return (
                        <div key={item.name} className={`p-3 rounded-lg ${
                          status.color === 'green' ? 'bg-green-50' :
                          status.color === 'red' ? 'bg-red-50' : 'bg-orange-50'
                        }`}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-medium">{item.name}:</span>
                            <span className={`font-bold ${
                              status.color === 'green' ? 'text-green-700' :
                              status.color === 'red' ? 'text-red-700' : 'text-orange-700'
                            }`}>
                              {item.actual} / {item.target} {item.unit}
                            </span>
                          </div>
                          <div className="text-xs mb-2">
                            Toleransi: {item.range.min} - {item.range.max} {item.unit}
                          </div>
                          <div className={`w-full rounded-full h-2 ${
                            status.color === 'green' ? 'bg-green-200' :
                            status.color === 'red' ? 'bg-red-200' : 'bg-orange-200'
                          }`}>
                            <div 
                              className={`h-2 rounded-full ${
                                status.color === 'green' ? 'bg-green-600' :
                                status.color === 'red' ? 'bg-red-600' : 'bg-orange-600'
                              }`}
                              style={{ width: `${Math.min(getAchievementPercentage(item.actual, item.target), 100)}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                            <span className={`${
                              status.color === 'green' ? 'text-green-600' :
                              status.color === 'red' ? 'text-red-600' : 'text-orange-600'
                            }`}>
                              {getAchievementPercentage(item.actual, item.target)}% dari target
                            </span>
                            <span className={`font-medium ${
                              status.color === 'green' ? 'text-green-700' :
                              status.color === 'red' ? 'text-red-700' : 'text-orange-700'
                            }`}>
                              Status: {status.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Menu Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Komposisi Menu</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p><strong>Nama Menu:</strong> {menuName || 'Tidak ada nama'}</p>
                  <p><strong>Waktu Makan:</strong> {selectedMealType ? mealTypes[selectedMealType as keyof typeof mealTypes]?.name : 'Tidak dipilih'}</p>
                  <p><strong>Target:</strong> Rentang umur {startAge}-{endAge} tahun (Rata-rata)</p>
                  <p><strong>Jumlah Item:</strong> {menuItems.length} makanan</p>
                  <p><strong>Total Berat:</strong> {menuItems.reduce((total, item) => total + item.actualWeight, 0)} gram</p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">
                    <strong>Kategori yang Sudah Ditambahkan:</strong>
                  </p>
                  <div className="text-sm text-blue-600">
                    {Array.from(new Set(menuItems.map(item => getCategoryDisplayName(item.category)))).join(', ')}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 mb-2">
                    <strong>Status Kecukupan Gizi Keseluruhan:</strong>
                  </p>
                  <div className="text-sm space-y-1">
                    <div className="mb-3">
                      <strong>Kebutuhan Harian:</strong>
                      {[
                        { name: 'Energi', actual: totalNutrition.energy, range: toleranceRanges.energy },
                        { name: 'Protein', actual: totalNutrition.protein, range: toleranceRanges.protein },
                        { name: 'Lemak', actual: totalNutrition.fat, range: toleranceRanges.fat },
                        { name: 'Karbohidrat', actual: totalNutrition.carbohydrate, range: toleranceRanges.carbohydrate }
                      ].map(item => (
                        <div key={item.name} className={`${
                          getNutritionStatus(item.actual, item.range).color === 'green' ? 'text-green-600' :
                          getNutritionStatus(item.actual, item.range).color === 'red' ? 'text-red-600' : 'text-orange-600'
                        }`}>
                          {getNutritionStatus(item.actual, item.range).status === 'sesuai' ? '✅' : 
                           getNutritionStatus(item.actual, item.range).status === 'kurang' ? '⚠️' : '🔶'} 
                          {item.name}: {getNutritionStatus(item.actual, item.range).status}
                        </div>
                      ))}
                    </div>
                    
                    {selectedMealType && (
                      <div>
                        <strong>Kebutuhan {mealTypes[selectedMealType as keyof typeof mealTypes]?.name}:</strong>
                        {[
                          { name: 'Energi', actual: totalNutrition.energy, range: getMealToleranceRanges(selectedMealType).energy },
                          { name: 'Protein', actual: totalNutrition.protein, range: getMealToleranceRanges(selectedMealType).protein },
                          { name: 'Lemak', actual: totalNutrition.fat, range: getMealToleranceRanges(selectedMealType).fat },
                          { name: 'Karbohidrat', actual: totalNutrition.carbohydrate, range: getMealToleranceRanges(selectedMealType).carbohydrate }
                        ].map(item => (
                          <div key={item.name} className={`${
                            getNutritionStatus(item.actual, item.range).color === 'green' ? 'text-green-600' :
                            getNutritionStatus(item.actual, item.range).color === 'red' ? 'text-red-600' : 'text-orange-600'
                          }`}>
                            {getNutritionStatus(item.actual, item.range).status === 'sesuai' ? '✅' : 
                             getNutritionStatus(item.actual, item.range).status === 'kurang' ? '⚠️' : '🔶'} 
                            {item.name}: {getNutritionStatus(item.actual, item.range).status}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuComposer;
