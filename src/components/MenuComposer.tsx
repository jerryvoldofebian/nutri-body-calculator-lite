
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, UtensilsCrossed } from "lucide-react";
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

  return (
    <div className="space-y-6">
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
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Ringkasan Gizi Menu</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                    <span className="font-medium">Total Energi:</span>
                    <span className="font-bold text-yellow-700">{totalNutrition.energy} kkal</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="font-medium">Total Protein:</span>
                    <span className="font-bold text-red-700">{totalNutrition.protein} g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="font-medium">Total Lemak:</span>
                    <span className="font-bold text-orange-700">{totalNutrition.fat} g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="font-medium">Total Karbohidrat:</span>
                    <span className="font-bold text-amber-700">{totalNutrition.carbohydrate} g</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="font-medium">Total Serat:</span>
                    <span className="font-bold text-green-700">{totalNutrition.fiber} g</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Komposisi Menu</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p><strong>Nama Menu:</strong> {menuName || 'Tidak ada nama'}</p>
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
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MenuComposer;
