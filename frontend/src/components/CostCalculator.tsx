import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card } from './ui/card';
import { Calculator, Info } from 'lucide-react';

interface CostCalculatorProps {
  open: boolean;
  onClose: () => void;
  onCalculate: (cost: number, details: any) => void;
  selectedFabrics?: any[];
  selectedCurtainRods?: any[];
}

export function CostCalculator({ open, onClose, onCalculate, selectedFabrics = [], selectedCurtainRods = [] }: CostCalculatorProps) {
  const [measurements, setMeasurements] = useState({
    width: '',
    height: '',
    fabricPricePerMeter: '',
    curtainRodPrice: '',
    laborCost: '',
    additionalCosts: '',
  });

  const [result, setResult] = useState<number | null>(null);
  const [breakdown, setBreakdown] = useState<any>(null);

  // Auto-fill prices if fabrics or curtain rods are selected
  useEffect(() => {
    if (selectedFabrics.length > 0 && !measurements.fabricPricePerMeter) {
      const avgPrice = selectedFabrics.reduce((sum, f) => sum + f.price, 0) / selectedFabrics.length;
      setMeasurements(prev => ({ ...prev, fabricPricePerMeter: avgPrice.toString() }));
    }
    if (selectedCurtainRods.length > 0 && !measurements.curtainRodPrice) {
      const totalRodPrice = selectedCurtainRods.reduce((sum, r) => sum + r.price, 0);
      setMeasurements(prev => ({ ...prev, curtainRodPrice: totalRodPrice.toString() }));
    }
  }, [selectedFabrics, selectedCurtainRods, open]);

  const handleChange = (field: string, value: string) => {
    setMeasurements((prev) => ({ ...prev, [field]: value }));
  };

  const calculateCost = () => {
    const width = parseFloat(measurements.width) || 0;
    const height = parseFloat(measurements.height) || 0;
    const fabricPrice = parseFloat(measurements.fabricPricePerMeter) || 0;
    const rodPrice = parseFloat(measurements.curtainRodPrice) || 0;
    const labor = parseFloat(measurements.laborCost) || 0;
    const additional = parseFloat(measurements.additionalCosts) || 0;

    // Calculate area in square meters
    const area = (width * height) / 10000; // Convert cm² to m²

    // Calculate total cost
    const fabricCost = area * fabricPrice;
    const total = fabricCost + rodPrice + labor + additional;

    const detailedBreakdown = {
      area,
      fabricCost,
      rodPrice,
      labor,
      additional,
      total
    };

    setBreakdown(detailedBreakdown);
    setResult(total);
  };

  const handleConfirm = () => {
    if (result !== null) {
      onCalculate(result, breakdown);
    }
  };

  const handleReset = () => {
    setMeasurements({
      width: '',
      height: '',
      fabricPricePerMeter: '',
      curtainRodPrice: '',
      laborCost: '',
      additionalCosts: '',
    });
    setResult(null);
    setBreakdown(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            Калькулятор стоимости
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Materials Info */}
          {(selectedFabrics.length > 0 || selectedCurtainRods.length > 0) && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  {selectedFabrics.length > 0 && (
                    <div className="mb-1">
                      <strong>Выбрано тканей:</strong> {selectedFabrics.map(f => f.name).join(', ')}
                    </div>
                  )}
                  {selectedCurtainRods.length > 0 && (
                    <div>
                      <strong>Выбрано карнизов:</strong> {selectedCurtainRods.map(r => r.name).join(', ')}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Measurements */}
          <div>
            <h3 className="mb-3">Размеры окна</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Ширина (см)</Label>
                <Input
                  id="width"
                  type="number"
                  value={measurements.width}
                  onChange={(e) => handleChange('width', e.target.value)}
                  placeholder="например, 200"
                />
              </div>
              <div>
                <Label htmlFor="height">Высота (см)</Label>
                <Input
                  id="height"
                  type="number"
                  value={measurements.height}
                  onChange={(e) => handleChange('height', e.target.value)}
                  placeholder="например, 250"
                />
              </div>
            </div>
          </div>

          {/* Costs */}
          <div>
            <h3 className="mb-3">Стоимость</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="fabricPrice">Цена ткани за м² (₽)</Label>
                <Input
                  id="fabricPrice"
                  type="number"
                  value={measurements.fabricPricePerMeter}
                  onChange={(e) => handleChange('fabricPricePerMeter', e.target.value)}
                  placeholder="например, 2850"
                />
              </div>
              <div>
                <Label htmlFor="curtainRodPrice">Стоимость карниза (₽)</Label>
                <Input
                  id="curtainRodPrice"
                  type="number"
                  value={measurements.curtainRodPrice}
                  onChange={(e) => handleChange('curtainRodPrice', e.target.value)}
                  placeholder="например, 1500"
                />
              </div>
              <div>
                <Label htmlFor="laborCost">Стоимость работ (₽)</Label>
                <Input
                  id="laborCost"
                  type="number"
                  value={measurements.laborCost}
                  onChange={(e) => handleChange('laborCost', e.target.value)}
                  placeholder="например, 3000"
                />
              </div>
              <div>
                <Label htmlFor="additionalCosts">Дополнительные расходы (₽)</Label>
                <Input
                  id="additionalCosts"
                  type="number"
                  value={measurements.additionalCosts}
                  onChange={(e) => handleChange('additionalCosts', e.target.value)}
                  placeholder="например, 500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Фурнитура, аксессуары, доставка и т.д.
                </p>
              </div>
            </div>
          </div>

          {/* Calculate Button */}
          <Button onClick={calculateCost} className="w-full">
            Рассчитать стоимость
          </Button>

          {/* Result */}
          {result !== null && breakdown && (
            <Card className="p-6 bg-green-50 border-green-200">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-2">Расчётная стоимость</div>
                <div className="text-4xl text-green-700 mb-4">
                  Итого: {Math.round(result).toLocaleString('ru-RU')} ₽
                </div>
                <div className="text-sm text-gray-700 space-y-2 text-left max-w-xs mx-auto">
                  <div className="flex justify-between pb-2 border-b">
                    <span>Площадь:</span>
                    <span>{breakdown.area.toFixed(2)} м²</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ткань:</span>
                    <span>{Math.round(breakdown.fabricCost).toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Карниз:</span>
                    <span>{Math.round(breakdown.rodPrice).toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Работа:</span>
                    <span>{Math.round(breakdown.labor).toLocaleString('ru-RU')} ₽</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Дополнительно:</span>
                    <span>{Math.round(breakdown.additional).toLocaleString('ru-RU')} ₽</span>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Сброс
            </Button>
            <Button variant="outline" onClick={onClose} className="flex-1">
              Отмена
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={result === null}
              className="flex-1"
            >
              Сохранить расчёт
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
