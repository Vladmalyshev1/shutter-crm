import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Search, Check, Filter } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Fabric {
  id: string;
  name: string;
  color: string;
  material: string;
  price: number;
  category: string;
  type: string;
  density?: string;
  image?: string;
}

interface CurtainRod {
  id: string;
  name: string;
  material: string;
  color: string;
  length: string;
  price: number;
  type: string;
}

const MOCK_FABRICS: Fabric[] = [
  { id: '1', name: 'Велюр Люкс', color: 'Темно-синий', material: 'Велюр', price: 2850, category: 'Премиум', type: 'Блэкаут', density: 'Высокая' },
  { id: '2', name: 'Шёлк Элеганс', color: 'Слоновая кость', material: 'Шёлк', price: 4200, category: 'Премиум', type: 'Органза', density: 'Средняя' },
  { id: '3', name: 'Хлопок Классик', color: 'Белый', material: 'Хлопок', price: 1650, category: 'Стандарт', type: 'Полупрозрачная', density: 'Средняя' },
  { id: '4', name: 'Лён Натуральный', color: 'Бежевый', material: 'Лён', price: 2100, category: 'Стандарт', type: 'Полупрозрачная', density: 'Средняя' },
  { id: '5', name: 'Атлас Блеск', color: 'Золотой', material: 'Атлас', price: 3200, category: 'Премиум', type: 'Плотная', density: 'Высокая' },
  { id: '6', name: 'Полиэстер Про', color: 'Серый', material: 'Полиэстер', price: 1200, category: 'Эконом', type: 'Блэкаут', density: 'Высокая' },
  { id: '7', name: 'Велюр Роял', color: 'Бордовый', material: 'Велюр', price: 3000, category: 'Премиум', type: 'Блэкаут', density: 'Высокая' },
  { id: '8', name: 'Хлопок Микс', color: 'Кремовый', material: 'Хлопок', price: 1900, category: 'Стандарт', type: 'Плотная', density: 'Средняя' },
  { id: '9', name: 'Органза Легкая', color: 'Белый', material: 'Органза', price: 1400, category: 'Стандарт', type: 'Органза', density: 'Низкая' },
  { id: '10', name: 'Блэкаут Премиум', color: 'Черный', material: 'Специальная ткань', price: 3500, category: 'Премиум', type: 'Блэкаут', density: 'Высокая' },
];

const MOCK_CURTAIN_RODS: CurtainRod[] = [
  { id: 'r1', name: 'Карниз Классик', material: 'Металл', color: 'Хром', length: '2м', price: 1500, type: 'Настенный' },
  { id: 'r2', name: 'Карниз Премиум', material: 'Алюминий', color: 'Золото', length: '2.5м', price: 2800, type: 'Настенный' },
  { id: 'r3', name: 'Карниз Минимал', material: 'Сталь', color: 'Белый', length: '2м', price: 1200, type: 'Настенный' },
  { id: 'r4', name: 'Карниз Деко', material: 'Дерево', color: 'Венге', length: '3м', price: 3500, type: 'Настенный' },
  { id: 'r5', name: 'Карниз Потолочный', material: 'Пластик', color: 'Белый', length: '2м', price: 900, type: 'Потолочный' },
  { id: 'r6', name: 'Карниз Элит', material: 'Металл', color: 'Бронза', length: '2.5м', price: 4200, type: 'Настенный' },
  { id: 'r7', name: 'Карниз Эконом', material: 'Пластик', color: 'Белый', length: '1.5м', price: 650, type: 'Потолочный' },
  { id: 'r8', name: 'Карниз Модерн', material: 'Алюминий', color: 'Черный', length: '2м', price: 2200, type: 'Настенный' },
];

interface FabricCatalogProps {
  open: boolean;
  onClose: () => void;
  onSelect: (fabrics: Fabric[], curtainRods: CurtainRod[]) => void;
  selectedFabrics: Fabric[];
  selectedCurtainRods?: CurtainRod[];
}

export function FabricCatalog({ open, onClose, onSelect, selectedFabrics, selectedCurtainRods = [] }: FabricCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [tempSelectedFabrics, setTempSelectedFabrics] = useState<Fabric[]>(selectedFabrics);
  const [tempSelectedRods, setTempSelectedRods] = useState<CurtainRod[]>(selectedCurtainRods);
  const [fabricType, setFabricType] = useState('all');
  const [fabricDensity, setFabricDensity] = useState('all');
  const [fabricColor, setFabricColor] = useState('all');
  const [rodType, setRodType] = useState('all');
  const [currentTab, setCurrentTab] = useState('fabrics');

  const filteredFabrics = MOCK_FABRICS.filter((fabric) => {
    const matchesSearch =
      fabric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fabric.material.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category === 'all' || fabric.category === category;
    const matchesType = fabricType === 'all' || fabric.type === fabricType;
    const matchesDensity = fabricDensity === 'all' || fabric.density === fabricDensity;
    const matchesColor = fabricColor === 'all' || fabric.color.toLowerCase().includes(fabricColor.toLowerCase());
    return matchesSearch && matchesCategory && matchesType && matchesDensity && matchesColor;
  });

  const filteredCurtainRods = MOCK_CURTAIN_RODS.filter((rod) => {
    const matchesSearch =
      rod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rod.material.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rod.color.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = rodType === 'all' || rod.type === rodType;
    return matchesSearch && matchesType;
  });

  const toggleFabric = (fabric: Fabric) => {
    if (tempSelectedFabrics.find((f) => f.id === fabric.id)) {
      setTempSelectedFabrics(tempSelectedFabrics.filter((f) => f.id !== fabric.id));
    } else {
      setTempSelectedFabrics([...tempSelectedFabrics, fabric]);
    }
  };

  const toggleCurtainRod = (rod: CurtainRod) => {
    if (tempSelectedRods.find((r) => r.id === rod.id)) {
      setTempSelectedRods(tempSelectedRods.filter((r) => r.id !== rod.id));
    } else {
      setTempSelectedRods([...tempSelectedRods, rod]);
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelectedFabrics, tempSelectedRods);
  };

  const handleClose = () => {
    setTempSelectedFabrics(selectedFabrics);
    setTempSelectedRods(selectedCurtainRods);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Каталог материалов</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Main Tabs: Fabrics and Curtain Rods */}
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fabrics">Ткани</TabsTrigger>
              <TabsTrigger value="rods">Карнизы</TabsTrigger>
            </TabsList>

            <TabsContent value="fabrics" className="space-y-4 flex-1 overflow-hidden flex flex-col mt-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию, цвету или материалу..."
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Категория</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="Премиум">Премиум</SelectItem>
                      <SelectItem value="Стандарт">Стандарт</SelectItem>
                      <SelectItem value="Эконом">Эконом</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Тип</label>
                  <Select value={fabricType} onValueChange={setFabricType}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="Блэкаут">Блэкаут</SelectItem>
                      <SelectItem value="Органза">Органза</SelectItem>
                      <SelectItem value="Плотная">Плотная</SelectItem>
                      <SelectItem value="Полупрозрачная">Полупрозрачная</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Плотность</label>
                  <Select value={fabricDensity} onValueChange={setFabricDensity}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="Высокая">Высокая</SelectItem>
                      <SelectItem value="Средняя">Средняя</SelectItem>
                      <SelectItem value="Низкая">Низкая</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Цвет</label>
                  <Select value={fabricColor} onValueChange={setFabricColor}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="белый">Белый</SelectItem>
                      <SelectItem value="бежевый">Бежевый</SelectItem>
                      <SelectItem value="серый">Серый</SelectItem>
                      <SelectItem value="синий">Синий</SelectItem>
                      <SelectItem value="черный">Черный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selected Count */}
              {tempSelectedFabrics.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">
                    Выбрано тканей: {tempSelectedFabrics.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTempSelectedFabrics([])}
                  >
                    Очистить
                  </Button>
                </div>
              )}

              {/* Fabric Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
                  {filteredFabrics.map((fabric) => {
                    const isSelected = tempSelectedFabrics.find((f) => f.id === fabric.id);
                    return (
                      <button
                        key={fabric.id}
                        onClick={() => toggleFabric(fabric)}
                        className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{fabric.name}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-indigo-600" />
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {fabric.color} • {fabric.material}
                            </div>
                            <div className="text-xs text-gray-500">
                              {fabric.type} • {fabric.density}
                            </div>
                          </div>
                          <Badge variant={fabric.category === 'Премиум' ? 'default' : 'secondary'} className="text-xs">
                            {fabric.category}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <span className="text-xs text-gray-600">
                            Цена за м²
                          </span>
                          <span className="text-indigo-600">{fabric.price} ₽</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rods" className="space-y-4 flex-1 overflow-hidden flex flex-col mt-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по названию, материалу или цвету..."
                  className="pl-10"
                />
              </div>

              {/* Curtain Rod Type Filter */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Тип карниза</label>
                  <Select value={rodType} onValueChange={setRodType}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="Настенный">Настенный</SelectItem>
                      <SelectItem value="Потолочный">Потолочный</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Selected Count */}
              {tempSelectedRods.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">
                    Выбрано карнизов: {tempSelectedRods.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTempSelectedRods([])}
                  >
                    Очистить
                  </Button>
                </div>
              )}

              {/* Curtain Rod Grid */}
              <div className="flex-1 overflow-y-auto">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 pb-4">
                  {filteredCurtainRods.map((rod) => {
                    const isSelected = tempSelectedRods.find((r) => r.id === rod.id);
                    return (
                      <button
                        key={rod.id}
                        onClick={() => toggleCurtainRod(rod)}
                        className={`p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm">{rod.name}</span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-indigo-600" />
                              )}
                            </div>
                            <div className="text-xs text-gray-600 mb-1">
                              {rod.material} • {rod.color}
                            </div>
                            <div className="text-xs text-gray-500">
                              {rod.type} • {rod.length}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <span className="text-xs text-gray-600">
                            Цена за шт.
                          </span>
                          <span className="text-indigo-600">{rod.price} ₽</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Отмена
            </Button>
            <Button onClick={handleConfirm} className="flex-1">
              Подтвердить выбор
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
