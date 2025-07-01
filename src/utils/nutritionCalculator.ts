
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

// Data AKG berdasarkan tabel yang diberikan
const nutritionData = {
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

export function calculateNutritionNeeds(userData: UserData): NutritionNeeds {
  const { gender, age } = userData;
  const ageCategory = getAgeCategory(age);
  const categoryType = getCategoryType(age);
  
  // Dapatkan data gizi berdasarkan gender, kategori umur, dan tipe
  const genderKey = gender as keyof typeof nutritionData;
  const baseData = nutritionData[genderKey]?.[categoryType]?.[ageCategory as keyof typeof nutritionData[typeof genderKey][typeof categoryType]];
  
  if (!baseData) {
    // Fallback ke data dewasa 19-29 tahun jika tidak ada data spesifik
    const fallbackData = nutritionData[genderKey]?.adult?.['19-29years'] || nutritionData.male.adult['19-29years'];
    return {
      energy: fallbackData.energy,
      protein: fallbackData.protein,
      fat: {
        total: fallbackData.fatTotal,
        omega3: fallbackData.omega3,
        omega6: fallbackData.omega6
      },
      carbohydrate: fallbackData.carb,
      fiber: fallbackData.fiber,
      water: fallbackData.water,
      category: `${gender === 'male' ? 'Laki-laki' : 'Perempuan'} ${age} tahun`
    };
  }

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
