interface UserData {
  gender: string;
  weight: number;
  height: number;
  age: number;
}

interface NutritionNeeds {
  energy: number;
  protein: number;
  fat: {
    total: number;
    omega3: number;
    omega6: number;
  };
  carbohydrate: number;
  fiber: number;
  water: number;
  category: string;
}

interface NutritionDataItem {
  energy: number;
  protein: number;
  fatTotal: number;
  omega3: number;
  omega6: number;
  carb: number;
  fiber: number;
  water: number;
}

// Data AKG berdasarkan tabel yang diberikan
const nutritionData: {
  male: {
    children: Record<string, NutritionDataItem>;
    adult: Record<string, NutritionDataItem>;
  };
  female: {
    children: Record<string, NutritionDataItem>;
    adult: Record<string, NutritionDataItem>;
  };
} = {
  male: {
    children: {
      '0-5months': { energy: 550, protein: 9, fatTotal: 31, omega3: 0.5, omega6: 4.4, carb: 59, fiber: 0, water: 700 },
      '6-11months': { energy: 800, protein: 15, fatTotal: 35, omega3: 0.5, omega6: 4.4, carb: 105, fiber: 11, water: 900 },
      '1-3years': { energy: 1350, protein: 20, fatTotal: 45, omega3: 0.7, omega6: 7, carb: 215, fiber: 19, water: 1150 },
      '4-6years': { energy: 1400, protein: 25, fatTotal: 50, omega3: 0.9, omega6: 10, carb: 220, fiber: 20, water: 1450 },
      '7-9years': { energy: 1650, protein: 40, fatTotal: 55, omega3: 0.9, omega6: 10, carb: 250, fiber: 23, water: 1650 }
    },
    adult: {
      '10-12years': { energy: 2000, protein: 50, fatTotal: 65, omega3: 1.2, omega6: 12, carb: 300, fiber: 28, water: 1850 },
      '13-15years': { energy: 2400, protein: 70, fatTotal: 80, omega3: 1.6, omega6: 16, carb: 350, fiber: 34, water: 2100 },
      '16-18years': { energy: 2650, protein: 75, fatTotal: 85, omega3: 1.6, omega6: 16, carb: 400, fiber: 37, water: 2300 },
      '19-29years': { energy: 2650, protein: 65, fatTotal: 75, omega3: 1.6, omega6: 17, carb: 430, fiber: 37, water: 2500 },
      '30-49years': { energy: 2550, protein: 65, fatTotal: 70, omega3: 1.6, omega6: 17, carb: 415, fiber: 36, water: 2500 },
      '50-64years': { energy: 2150, protein: 65, fatTotal: 60, omega3: 1.6, omega6: 14, carb: 340, fiber: 30, water: 2500 },
      '65-80years': { energy: 1800, protein: 64, fatTotal: 50, omega3: 1.6, omega6: 14, carb: 275, fiber: 25, water: 1800 },
      '80+years': { energy: 1600, protein: 64, fatTotal: 45, omega3: 1.6, omega6: 14, carb: 235, fiber: 22, water: 1600 }
    }
  },
  female: {
    children: {
      '0-5months': { energy: 550, protein: 9, fatTotal: 31, omega3: 0.5, omega6: 4.4, carb: 59, fiber: 0, water: 700 },
      '6-11months': { energy: 800, protein: 15, fatTotal: 35, omega3: 0.5, omega6: 4.4, carb: 105, fiber: 11, water: 900 },
      '1-3years': { energy: 1350, protein: 20, fatTotal: 45, omega3: 0.7, omega6: 7, carb: 215, fiber: 19, water: 1150 },
      '4-6years': { energy: 1400, protein: 25, fatTotal: 50, omega3: 0.9, omega6: 10, carb: 220, fiber: 20, water: 1450 },
      '7-9years': { energy: 1650, protein: 40, fatTotal: 55, omega3: 0.9, omega6: 10, carb: 250, fiber: 23, water: 1650 }
    },
    adult: {
      '10-12years': { energy: 1900, protein: 55, fatTotal: 65, omega3: 1.0, omega6: 10, carb: 280, fiber: 27, water: 1850 },
      '13-15years': { energy: 2050, protein: 65, fatTotal: 70, omega3: 1.1, omega6: 11, carb: 300, fiber: 29, water: 2100 },
      '16-18years': { energy: 2100, protein: 65, fatTotal: 70, omega3: 1.1, omega6: 11, carb: 300, fiber: 29, water: 2150 },
      '19-29years': { energy: 2250, protein: 60, fatTotal: 65, omega3: 1.1, omega6: 12, carb: 360, fiber: 32, water: 2350 }
    }
  }
};

function getAgeCategory(age: number): string {
  if (age < 1) return '0-5months';
  if (age < 2) return '6-11months';
  if (age <= 3) return '1-3years';
  if (age <= 6) return '4-6years';
  if (age <= 9) return '7-9years';
  if (age <= 12) return '10-12years';
  if (age <= 15) return '13-15years';
  if (age <= 18) return '16-18years';
  if (age <= 29) return '19-29years';
  if (age <= 49) return '30-49years';
  if (age <= 64) return '50-64years';
  if (age <= 80) return '65-80years';
  return '80+years';
}

function getCategoryType(age: number): 'children' | 'adult' {
  return age <= 9 ? 'children' : 'adult';
}

// Fungsi untuk menentukan apakah menggunakan rata-rata atau nilai apa adanya
function shouldUseAverage(age: number): boolean {
  return age > 9; // Untuk umur > 9 tahun gunakan rata-rata
}

// Fungsi untuk menghitung rata-rata kebutuhan gizi berdasarkan kelompok umur
export function calculateAverageNutrition(age: number): NutritionNeeds {
  const ageCategory = getAgeCategory(age);
  const categoryType = getCategoryType(age);
  
  // Default fallback data
  const defaultData: NutritionDataItem = {
    energy: 2650,
    protein: 65,
    fatTotal: 75,
    omega3: 1.6,
    omega6: 17,
    carb: 430,
    fiber: 37,
    water: 2500
  };

  // Get data for both genders
  const maleData = nutritionData.male[categoryType][ageCategory] || defaultData;
  const femaleData = nutritionData.female[categoryType][ageCategory] || defaultData;
  
  // Calculate averages
  const averageData = {
    energy: Math.round((maleData.energy + femaleData.energy) / 2),
    protein: Math.round((maleData.protein + femaleData.protein) / 2),
    fatTotal: Math.round((maleData.fatTotal + femaleData.fatTotal) / 2),
    omega3: Math.round((maleData.omega3 + femaleData.omega3) / 2 * 10) / 10,
    omega6: Math.round((maleData.omega6 + femaleData.omega6) / 2 * 10) / 10,
    carb: Math.round((maleData.carb + femaleData.carb) / 2),
    fiber: Math.round((maleData.fiber + femaleData.fiber) / 2),
    water: Math.round((maleData.water + femaleData.water) / 2)
  };

  return {
    energy: averageData.energy,
    protein: averageData.protein,
    fat: {
      total: averageData.fatTotal,
      omega3: averageData.omega3,
      omega6: averageData.omega6
    },
    carbohydrate: averageData.carb,
    fiber: averageData.fiber,
    water: averageData.water,
    category: `Rata-rata ${age} tahun (${ageCategory.replace(/years|months/, ' tahun').replace('-', '-')})`
  };
}

// Fungsi baru untuk menghitung kebutuhan gizi menu (rata-rata atau individual)
export function calculateMenuNutritionNeeds(age: number, gender?: string): NutritionNeeds {
  if (shouldUseAverage(age)) {
    // Untuk umur > 9 tahun, gunakan rata-rata
    return calculateAverageNutrition(age);
  } else {
    // Untuk bayi/anak-anak (≤ 9 tahun), gunakan nilai apa adanya berdasarkan gender
    // Jika gender tidak disediakan, gunakan rata-rata
    if (!gender) {
      return calculateAverageNutrition(age);
    }
    
    return calculateNutritionNeeds({
      gender: gender,
      weight: 20, // Default weight for children
      height: 110, // Default height for children
      age: age
    });
  }
}

// Fungsi untuk menghitung kontribusi energi per waktu makan
export interface MealContribution {
  breakfast: number;    // 25%
  lunch: number;       // 30%
  dinner: number;      // 25%
  morningSnack: number; // 10%
  afternoonSnack: number; // 10%
}

export function calculateMealContribution(totalNutrition: NutritionNeeds): {
  energy: MealContribution;
  protein: MealContribution;
  fat: MealContribution;
  carbohydrate: MealContribution;
  fiber: MealContribution;
  water: MealContribution;
} {
  const distributeMeal = (total: number): MealContribution => ({
    breakfast: Math.round(total * 0.25),
    lunch: Math.round(total * 0.30),
    dinner: Math.round(total * 0.25),
    morningSnack: Math.round(total * 0.10),
    afternoonSnack: Math.round(total * 0.10)
  });

  return {
    energy: distributeMeal(totalNutrition.energy),
    protein: distributeMeal(totalNutrition.protein),
    fat: distributeMeal(totalNutrition.fat.total),
    carbohydrate: distributeMeal(totalNutrition.carbohydrate),
    fiber: distributeMeal(totalNutrition.fiber),
    water: distributeMeal(totalNutrition.water)
  };
}

export function calculateNutritionNeeds(userData: UserData): NutritionNeeds {
  const { gender, age } = userData;
  const ageCategory = getAgeCategory(age);
  const categoryType = getCategoryType(age);
  
  // Default fallback data
  const defaultData: NutritionDataItem = {
    energy: 2650,
    protein: 65,
    fatTotal: 75,
    omega3: 1.6,
    omega6: 17,
    carb: 430,
    fiber: 37,
    water: 2500
  };

  // Get the appropriate gender data
  const genderData = gender === 'male' ? nutritionData.male : nutritionData.female;
  
  // Get the appropriate category data
  const categoryData = genderData[categoryType];
  
  // Get the specific age data or use default
  const baseData = categoryData[ageCategory] || defaultData;

  return {
    energy: baseData.energy,
    protein: baseData.protein,
    fat: {
      total: baseData.fatTotal,
      omega3: baseData.omega3,
      omega6: baseData.omega6
    },
    carbohydrate: baseData.carb,
    fiber: baseData.fiber,
    water: baseData.water,
    category: `${gender === 'male' ? 'Laki-laki' : 'Perempuan'} ${age} tahun (${ageCategory.replace(/years|months/, ' tahun').replace('-', '-')})`
  };
}
