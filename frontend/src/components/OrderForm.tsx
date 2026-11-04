import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card } from './ui/card';
import { ArrowLeft, Calendar, MapPin, Phone, User, Scissors } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { FabricCatalog } from './FabricCatalog';
import { CostCalculator } from './CostCalculator';

interface OrderFormProps {
  onBack: () => void;
  onSubmit: (order: any) => void;
}

export function OrderForm({ onBack, onSubmit }: OrderFormProps) {
  const [showFabricCatalog, setShowFabricCatalog] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedFabrics, setSelectedFabrics] = useState<any[]>([]);
  const [selectedCurtainRods, setSelectedCurtainRods] = useState<any[]>([]);
  const [calculatedCost, setCalculatedCost] = useState<number | null>(null);
  const [costBreakdown, setCostBreakdown] = useState<any>(null);

  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    serviceType: '',
    date: '',
    time: '',
    notes: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      selectedFabrics,
      selectedCurtainRods,
      calculatedCost,
      costBreakdown,
      id: Date.now().toString(),
      status: 'not-confirmed',
    });
  };

  const handleFabricSelect = (fabrics: any[], curtainRods: any[]) => {
    setSelectedFabrics(fabrics);
    setSelectedCurtainRods(curtainRods);
    setShowFabricCatalog(false);
  };

  const handleCalculateCost = (cost: number, breakdown: any) => {
    setCalculatedCost(cost);
    setCostBreakdown(breakdown);
    setShowCalculator(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="mb-1">Новый заказ</h1>
              <p className="text-gray-600">Создайте новый заказ клиента</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        <form onSubmit={handleSubmit}>
          <Card className="p-6">
            {/* Customer Information */}
            <div className="mb-6">
              <h2 className="mb-4">Информация о клиенте</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="customerName" className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    Полное имя
                  </Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    placeholder="Enter customer name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4" />
                    Номер телефона
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4" />
                    Адрес
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Enter customer address"
                      required
                    />
                    <Button type="button" variant="outline">
                      📍 Карта
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Автоматическое заполнение с помощью карт Яндекса/Google
                  </p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="mb-6">
              <h2 className="mb-4">Подробная информация об услуге</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="serviceType" className="flex items-center gap-2 mb-2">
                    <Scissors className="w-4 h-4" />
                    Вид услуги
                  </Label>
                  <Select
                    value={formData.serviceType}
                    
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select service type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="measurement">Замер</SelectItem>
                      <SelectItem value="tailoring">Пошив</SelectItem>
                      <SelectItem value="installation">Установка</SelectItem>
                      <SelectItem value="repair">Ремонт</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4" />
                      Дата визита
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="time" className="mb-2 block">
                      Время визита
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleChange('time', e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes" className="mb-2 block">
                    Дополнительные примечания
                  </Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Any special instructions or notes..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Fabric and Cost */}
            <div className="mb-6">
              <h2 className="mb-4">Ткань и стоимость</h2>
              <div className="space-y-4">
                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowFabricCatalog(true)}
                    className="w-full"
                  >
                    🧵 Открыть каталог материалов
                    {(selectedFabrics.length > 0 || selectedCurtainRods.length > 0) && (
                      <span className="ml-2 text-sm text-gray-600">
                        ({selectedFabrics.length + selectedCurtainRods.length} выбрано)
                      </span>
                    )}
                  </Button>
                </div>

                <div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCalculator(true)}
                    className="w-full"
                  >
                    🧮 Рассчитать стоимость
                    {calculatedCost !== null && (
                      <span className="ml-2 text-sm text-gray-600">
                        ({Math.round(calculatedCost).toLocaleString('ru-RU')} ₽)
                      </span>
                    )}
                  </Button>
                </div>

                {selectedFabrics.length > 0 && (
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="text-sm mb-2">Выбранные ткани:</div>
                    <div className="space-y-1">
                      {selectedFabrics.map((fabric) => (
                        <div key={fabric.id} className="text-sm">
                          • {fabric.name} - {fabric.color}
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {selectedCurtainRods.length > 0 && (
                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <div className="text-sm mb-2">Выбранные карнизы:</div>
                    <div className="space-y-1">
                      {selectedCurtainRods.map((rod) => (
                        <div key={rod.id} className="text-sm">
                          • {rod.name} - {rod.color} ({rod.length})
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {calculatedCost !== null && (
                  <Card className="p-4 bg-green-50 border-green-200">
                    <div className="text-sm text-gray-700">Расчётная стоимость:</div>
                    <div className="text-2xl text-green-700">
                      {Math.round(calculatedCost).toLocaleString('ru-RU')} ₽
                    </div>
                  </Card>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                Отмена
              </Button>
              <Button type="submit" className="flex-1">
                Создать заказ
              </Button>
            </div>
          </Card>
        </form>
      </div>

      {/* Modals */}
      <FabricCatalog
        open={showFabricCatalog}
        onClose={() => setShowFabricCatalog(false)}
        onSelect={handleFabricSelect}
        selectedFabrics={selectedFabrics}
        selectedCurtainRods={selectedCurtainRods}
      />

      <CostCalculator
        open={showCalculator}
        onClose={() => setShowCalculator(false)}
        onCalculate={handleCalculateCost}
        selectedFabrics={selectedFabrics}
        selectedCurtainRods={selectedCurtainRods}
      />
    </div>
  );
}
