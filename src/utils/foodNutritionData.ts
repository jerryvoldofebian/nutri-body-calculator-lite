
// Data makanan sumber karbohidrat
export const carbohydrateFoods = [
  { name: 'Bihun', portion: '1/2 Gelas', weight: 50 },
  { name: 'Biskuit', portion: '4 Buah Besar', weight: 40 },
  { name: 'Havermut', portion: '5 1/2 Sendok Makan', weight: 45 },
  { name: 'Jagung Segar', portion: '3 Buah Sedang', weight: 125 },
  { name: 'Kentang', portion: '2 Buah Sedang', weight: 210 },
  { name: 'Ketupat Hitam', portion: '1/2 Biji', weight: 125 },
  { name: 'Maizena', portion: '10 Sendok Makan', weight: 50 },
  { name: 'Makaroni', portion: '1/2 Gelas', weight: 50 },
  { name: 'Mie Basah', portion: '2 Gelas', weight: 200 },
  { name: 'Mie Kering', portion: '1 Gelas', weight: 50 },
  { name: 'Nasi Beras Giling putih', portion: '3/4 Gelas', weight: 100 },
  { name: 'Nasi Beras Giling Merah', portion: '3/4 Gelas', weight: 100 },
  { name: 'Nasi Beras Giling Hitam', portion: '3/4 Gelas', weight: 100 },
  { name: 'Nasi Beras 1/2 Giling', portion: '3/4 Gelas', weight: 100 },
  { name: 'Nasi Ketan Putih', portion: '3/4 Gelas', weight: 100 },
  { name: 'Roti Putih', portion: '3 Iris', weight: 70 },
  { name: 'Roti Warna Coklat', portion: '3 Iris', weight: 70 },
  { name: 'Singkong', portion: '1 1/2 Potong Sedang', weight: 120 },
  { name: 'Sukun', portion: '3 Potong Sedang', weight: 150 },
  { name: 'Talas', portion: '1/2 Biji Sedang', weight: 125 },
  { name: 'Tape Beras Ketan', portion: '5 Sendok Makan', weight: 100 },
  { name: 'Tape Singkong', portion: '1 Potong Sedang', weight: 100 },
  { name: 'Tepung Tapioca', portion: '8 Sendok Makan', weight: 50 },
  { name: 'Tepung Beras', portion: '8 Sendok Makan', weight: 50 },
  { name: 'Tepung Hunkwe', portion: '10 Sendok Makan', weight: 50 },
  { name: 'Tepung Sagu', portion: '8 Sendok Makan', weight: 50 },
  { name: 'Tepung Singkong', portion: '5 Sendok Makan', weight: 50 },
  { name: 'Tepung Terigu', portion: '5 Sendok Makan', weight: 50 },
  { name: 'Ubi Jalar Kuning', portion: '1 Biji Sedang', weight: 135 },
  { name: 'Kerupuk', portion: '3 Biji Sedang', weight: 30 }
];

// Data makanan sumber protein nabati
export const plantProteinFoods = [
  { name: 'Kacang Hijau', portion: '2 1/2 Sendok Makan', weight: 25 },
  { name: 'Kacang Kedelai', portion: '2 1/2 Sendok Makan', weight: 25 },
  { name: 'Kacang Merah', portion: '2 1/2 Sendok Makan', weight: 25 },
  { name: 'Kacang Mete', portion: '1 1/2 Sendok Makan', weight: 15 },
  { name: 'Kacang Tanah Kupas', portion: '2 Sendok Makan', weight: 20 },
  { name: 'Kacang Toto', portion: '2 Sendok Makan', weight: 20 },
  { name: 'Keju Kacang Tanah', portion: '1 Sendok Makan', weight: 15 },
  { name: 'Kembang Tahu', portion: '1 Lembar', weight: 20 },
  { name: 'Oncom', portion: '2 Potong Besar', weight: 50 },
  { name: 'Petai Segar', portion: '1 Papan/Biji Besar', weight: 20 },
  { name: 'Tahu', portion: '2 Potong Sedang', weight: 100 },
  { name: 'Sari Kedelai', portion: '2 1/2 Gelas', weight: 185 }
];

// Data makanan sumber protein hewani (ikan segar)
export const animalProteinFoods = [
  { name: 'Daging Sapi', portion: '1 Potong Sedang', weight: 35 },
  { name: 'Daging Ayam', portion: '1 Potong Sedang', weight: 40 },
  { name: 'Hati Sapi', portion: '1 Potong Sedang', weight: 50 },
  { name: 'Ikan Asin', portion: '1 Potong Kecil', weight: 50 },
  { name: 'Ikan Teri Kering', portion: '1 Sendok Makan', weight: 20 },
  { name: 'Telur Ayam', portion: '1 Butir', weight: 55 },
  { name: 'Udang Basah', portion: '5 Ekor Sedang', weight: 35 }
];

// Data makanan sumber protein hewani lainnya
export const otherAnimalProteinFoods = [
  { name: 'Susu Sapi', portion: '1 Gelas', weight: 200 },
  { name: 'Susu Kerbau', portion: '1/2 Gelas', weight: 100 },
  { name: 'Susu Kambing', portion: '3/4 Gelas', weight: 185 },
  { name: 'Tepung Sari Kedele', portion: '3 Sendok Makan', weight: 20 },
  { name: 'Tepung Susu Whole', portion: '4 Sendok Makan', weight: 20 },
  { name: 'Tepung Susu Krim', portion: '4 Sendok Makan', weight: 20 }
];

export interface FoodItem {
  name: string;
  portion: string;
  weight: number;
}

export interface NutritionPer100g {
  energy: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number;
}

// Fungsi untuk menghitung kandungan gizi per sajian
export const calculateNutritionPerServing = (
  servingWeight: number,
  nutritionPer100g: NutritionPer100g
): NutritionPer100g => {
  const ratio = servingWeight / 100;
  
  return {
    energy: Math.round(nutritionPer100g.energy * ratio),
    protein: Math.round(nutritionPer100g.protein * ratio * 10) / 10,
    fat: Math.round(nutritionPer100g.fat * ratio * 10) / 10,
    carbohydrate: Math.round(nutritionPer100g.carbohydrate * ratio * 10) / 10,
    fiber: Math.round(nutritionPer100g.fiber * ratio * 10) / 10
  };
};
