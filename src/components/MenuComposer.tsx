
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, UtensilsCrossed, Info, Target } from "lucide-react";
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
import { calculateMenuNutritionNeeds } from "../utils/nutritionCalculator";

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

const MenuComposer = () => {
  const [menuName, setMenuName] = useState('');
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [actualWeight, setActualWeight] = useState<number>(0);
  
  // Age-specific targeting
  const [targetAge, setTargetAge] = useState<number>(25);
  const [targetGender, setTargetGender] = useState<string>('male');
  const [showCalculationInfo, setShowCalculationInfo] = useState(false);

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

  // Get nutrition targets for specific age and gender using new logic
  const getNutritionTargets = () => {
    // Untuk bayi/anak-anak (≤ 9 tahun), gunakan gender
    // Untuk dewasa (> 9 tahun), gunakan rata-rata
    if (targetAge <= 9) {
      return calculateMenuNutritionNeeds(targetAge, targetGender);
    } else {
      return calculateMenuNutritionNeeds(targetAge);
    }
  };

  const targets = getNutritionTargets();

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
  };

  const getCategoryDisplayName = (category: string) => {
    return foodCategories[category as keyof typeof foodCategories]?.name || category;
  };

  const totalNutrition = calculateTotalNutrition();

  // Calculate percentage achievement
  const getAchievementPercentage = (actual: number, target: number) => {
    return Math.round((actual / target) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Age Target Selection */}
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Target Kelompok Umur
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Jenis Kelamin Target</Label>
              <Select 
                value={targetGender} 
                onValueChange={setTargetGender}
                disabled={targetAge > 9}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Laki-laki</SelectItem>
                  <SelectItem value="female">Perempuan</SelectItem>
                </SelectContent>
              </Select>
              {targetAge > 9 && (
                <p className="text-xs text-gray-500">
                  * Untuk umur {'>'}  9 tahun menggunakan rata-rata laki-laki dan perempuan
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Umur Target (tahun)</Label>
              <Input
                type="number"
                value={targetAge}
                onChange={(e) => setTargetAge(Number(e.target.value))}
                min="0"
                max="100"
              />
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">
              Target Kebutuhan Gizi Harian:
              {targetAge <= 9 ? (
                <span className="text-sm font-normal"> (Nilai Individual {targetGender === 'male' ? 'Laki-laki' : 'Perempuan'})</span>
              ) : (
                <span className="text-sm font-normal"> (Nilai Rata-rata)</span>
              )}
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              <div><strong>Energi:</strong> {targets.energy} kkal</div>
              <div><strong>Protein:</strong> {targets.protein} g</div>
              <div><strong>Lemak:</strong> {targets.fat.total} g</div>
              <div><strong>Karbohidrat:</strong> {targets.carbohydrate} g</div>
            </div>
            <div className="mt-2 text-xs text-purple-600">
              <strong>Kategori:</strong> {targets.category}
            </div>
          </div>
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
                    <p><strong>Perhitungan Target Kebutuhan Gizi:</strong></p>
                    <ul className="list-disc list-inside space-y-1 text-sm mt-2">
                      <li><strong>Bayi/Anak (≤ 9 tahun):</strong> Menggunakan nilai kebutuhan gizi individual sesuai jenis kelamin</li>
                      <li><strong>Remaja/Dewasa ({'>'}  9 tahun):</strong> Menggunakan nilai rata-rata kebutuhan gizi laki-laki dan perempuan</li>
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
          <div className="space-y-2">
            <Label>Nama Menu</Label>
            <Input
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              placeholder="Masukkan nama menu (contoh: Menu Sarapan, Menu Makan Siang)"
            />
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

      {menuItems.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
            <CardTitle>
              {menuName || 'Menu Makanan'} - Komposisi Menu
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

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Nutrition Achievement vs Target */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Pencapaian vs Target Gizi</h4>
                <div className="text-xs text-gray-600 mb-3">
                  Target berdasarkan: {targetAge <= 9 ? 
                    `Nilai individual ${targetGender === 'male' ? 'laki-laki' : 'perempuan'} umur ${targetAge} tahun` : 
                    `Nilai rata-rata umur ${targetAge} tahun`
                  }
                </div>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Energi:</span>
                      <span className="font-bold text-yellow-700">
                        {totalNutrition.energy} / {targets.energy} kkal
                      </span>
                    </div>
                    <div className="w-full bg-yellow-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(getAchievementPercentage(totalNutrition.energy, targets.energy), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-yellow-600">
                      {getAchievementPercentage(totalNutrition.energy, targets.energy)}% dari target
                    </span>
                  </div>

                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Protein:</span>
                      <span className="font-bold text-red-700">
                        {totalNutrition.protein} / {targets.protein} g
                      </span>
                    </div>
                    <div className="w-full bg-red-200 rounded-full h-2">
                      <div 
                        className="bg-red-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(getAchievementPercentage(totalNutrition.protein, targets.protein), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-red-600">
                      {getAchievementPercentage(totalNutrition.protein, targets.protein)}% dari target
                    </span>
                  </div>

                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Lemak:</span>
                      <span className="font-bold text-orange-700">
                        {totalNutrition.fat} / {targets.fat.total} g
                      </span>
                    </div>
                    <div className="w-full bg-orange-200 rounded-full h-2">
                      <div 
                        className="bg-orange-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(getAchievementPercentage(totalNutrition.fat, targets.fat.total), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-orange-600">
                      {getAchievementPercentage(totalNutrition.fat, targets.fat.total)}% dari target
                    </span>
                  </div>

                  <div className="p-3 bg-amber-50 rounded-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium">Karbohidrat:</span>
                      <span className="font-bold text-amber-700">
                        {totalNutrition.carbohydrate} / {targets.carbohydrate} g
                      </span>
                    </div>
                    <div className="w-full bg-amber-200 rounded-full h-2">
                      <div 
                        className="bg-amber-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(getAchievementPercentage(totalNutrition.carbohydrate, targets.carbohydrate), 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-amber-600">
                      {getAchievementPercentage(totalNutrition.carbohydrate, targets.carbohydrate)}% dari target
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Komposisi Menu</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p><strong>Nama Menu:</strong> {menuName || 'Tidak ada nama'}</p>
                  <p><strong>Target:</strong> {
                    targetAge <= 9 ? 
                      `${targetGender === 'male' ? 'Laki-laki' : 'Perempuan'} ${targetAge} tahun (Individual)` : 
                      `${targetAge} tahun (Rata-rata)`
                  }</p>
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
                    <strong>Status Kecukupan Gizi:</strong>
                  </p>
                  <div className="text-sm text-green-600">
                    {getAchievementPercentage(totalNutrition.energy, targets.energy) >= 80 ? 
                      '✅ Menu sudah cukup memenuhi kebutuhan energi' : 
                      '⚠️ Menu masih kurang memenuhi kebutuhan energi'
                    }
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
