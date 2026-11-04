import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Plus, Calendar as CalendarIcon, MapPin, Phone, User } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  serviceType: string;
  date: Date;
  status: 'not-confirmed' | 'confirmed' | 'completed';
}

interface HomeScreenProps {
  onCreateOrder: () => void;
  onOrderClick: (order: Order) => void;
  orders: Order[];
}

export function HomeScreen({ onCreateOrder, onOrderClick, orders }: HomeScreenProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'not-confirmed':
        return 'bg-red-500';
      case 'confirmed':
        return 'bg-green-500';
      case 'completed':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: Order['status']) => {
    switch (status) {
      case 'not-confirmed':
        return 'Not Confirmed';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };

  const getOrdersForSelectedDate = () => {
    if (!selectedDate) return [];
    return orders.filter((order) => {
      const orderDate = new Date(order.date);
      return (
        orderDate.getDate() === selectedDate.getDate() &&
        orderDate.getMonth() === selectedDate.getMonth() &&
        orderDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };

  const selectedDateOrders = getOrdersForSelectedDate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="mb-2">Календарь</h1>
          <p className="text-gray-600">Управляйте визитами и заказами ваших клиентов</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Calendar Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>Календарь</h2>
              <div className="flex gap-2">
                <Button
                  variant={view === 'day' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('day')}
                >
                  День
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('week')}
                >
                  Неделя
                </Button>
                <Button
                  variant={view === 'month' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setView('month')}
                >
                  Месяц
                </Button>
              </div>
            </div>

           

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm text-gray-600">Не подтверждено</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm text-gray-600">Подтверждено</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-400" />
                <span className="text-sm text-gray-600">Выполнено</span>
              </div>
            </div>
          </Card>

          {/* Orders List Section */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2>
                {selectedDate
                  ? `Orders for ${selectedDate.toLocaleDateString()}`
                  : 'All Orders'}
              </h2>
              <Badge variant="secondary">{selectedDateOrders.length}</Badge>
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {selectedDateOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>На эту дату заказов нет</p>
                  <Button onClick={onCreateOrder} variant="link" className="mt-2">
                    Создать новый заказ
                  </Button>
                </div>
              ) : (
                selectedDateOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => onOrderClick(order)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(order.status)}`} />
                        <span className="text-sm text-gray-600">
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Phone className="w-3 h-3" />
                      <span>{order.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-3 h-3" />
                      <span>{order.address}</span>
                    </div>
                    <Badge variant="outline">{order.serviceType}</Badge>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Summary Stats */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="p-6">
            <div className="text-gray-600 mb-1">Общее количество заказов</div>
            <div className="text-3xl">{orders.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 mb-1">Подтверждено</div>
            <div className="text-3xl text-green-600">
              {orders.filter(o => o.status === 'confirmed').length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-gray-600 mb-1">Не подтверждено</div>
            <div className="text-3xl text-red-600">
              {orders.filter(o => o.status === 'not-confirmed').length}
            </div>
          </Card>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onCreateOrder}
        className="fixed bottom-6 right-6 w-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
