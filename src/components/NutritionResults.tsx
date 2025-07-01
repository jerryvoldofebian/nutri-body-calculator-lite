
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Beef, 
  Droplets, 
  Wheat, 
  Leaf, 
  GlassWater 
} from "lucide-react";

interface NutritionResultsProps {
  results: {
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
  };
}

const NutritionResults: React.FC<NutritionResultsProps> = ({ results }) => {
  const nutritionItems = [
    {
      label: 'Energi',
      value: results.energy,
      unit: 'kkal',
      icon: Zap,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Protein',
      value: results.protein,
      unit: 'g',
      icon: Beef,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      label: 'Lemak Total',
      value: results.fat.total,
      unit: 'g',
      icon: Droplets,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Karbohidrat',
      value: results.carbohydrate,
      unit: 'g',
      icon: Wheat,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50'
    },
    {
      label: 'Serat',
      value: results.fiber,
      unit: 'g',
      icon: Leaf,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      label: 'Air',
      value: results.water,
      unit: 'ml',
      icon: GlassWater,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    }
  ];

  return (
    <div className="space-y-4">
      <Card className="shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardTitle className="text-center">Kebutuhan Gizi Harian Anda</CardTitle>
          <div className="text-center">
            <Badge variant="secondary" className="bg-white text-green-700">
              Kategori: {results.category}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nutritionItems.map((item, index) => (
              <div 
                key={index}
                className={`${item.bgColor} rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${item.color} p-2 rounded-full text-white`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">{item.label}</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {item.value} <span className="text-sm text-gray-600">{item.unit}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail Lemak */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-700 mb-3">Detail Kebutuhan Lemak:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Omega-3:</span>
                <span className="font-medium">{results.fat.omega3} g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Omega-6:</span>
                <span className="font-medium">{results.fat.omega6} g</span>
              </div>
            </div>
          </div>

          {/* Catatan */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Catatan:</strong> Hasil perhitungan ini berdasarkan Angka Kecukupan Gizi (AKG) 
              yang dianjurkan per orang per hari. Konsultasikan dengan ahli gizi untuk penyesuaian 
              lebih lanjut sesuai kondisi kesehatan Anda.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NutritionResults;
