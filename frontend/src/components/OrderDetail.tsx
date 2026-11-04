import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Scissors,
  DollarSign,
  Edit,
  Trash2,
  Camera,
  UserCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  serviceType: string;
  date: Date;
  status: 'not-confirmed' | 'confirmed' | 'completed';
  time?: string;
  notes?: string;
  selectedFabrics?: any[];
  calculatedCost?: number;
}

interface OrderDetailProps {
  order: Order;
  onBack: () => void;
  onStatusChange: (orderId: string, status: Order['status']) => void;
  onDelete: (orderId: string) => void;
  onViewClient?: () => void;
  onPhotoReport?: () => void;
}

export function OrderDetail({ order, onBack, onStatusChange, onDelete, onViewClient, onPhotoReport }: OrderDetailProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'not-confirmed':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
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
    }
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
            <div className="flex-1">
              <h1 className="mb-1">Детали заказа</h1>
              <p className="text-gray-600">Заказ #{order.id}</p>
            </div>
            <Badge className={getStatusColor(order.status)}>
              {getStatusLabel(order.status)}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Status Management */}
        <Card className="p-6">
          <h2 className="mb-4">Статус обновления</h2>
          <Select
            value={order.status}
            onValueChange={(value: Order['status']) => onStatusChange(order.id, value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="not-confirmed">Не подтверждено</SelectItem>
              <SelectItem value="confirmed">Подтверждено</SelectItem>
              <SelectItem value="completed">Выполнено</SelectItem>
            </SelectContent>
          </Select>
        </Card>

        {/* Customer Information */}
        <Card className="p-6">
          <h2 className="mb-4">Информация о клиенте</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Имя</div>
                <div>{order.customerName}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Номер</div>
                <div>{order.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Адрес</div>
                <div>{order.address}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Service Details */}
        <Card className="p-6">
          <h2 className="mb-4">Подробная информация об услуге</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Scissors className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Вид услуги</div>
                <div className="capitalize">{order.serviceType}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Дата визита</div>
                <div>{new Date(order.date).toLocaleDateString()}</div>
              </div>
            </div>
            {order.time && (
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-600">Время визита</div>
                  <div>{order.time}</div>
                </div>
              </div>
            )}
            {order.notes && (
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-1">Записи</div>
                <div className="p-3 bg-gray-50 rounded-lg">{order.notes}</div>
              </div>
            )}
          </div>
        </Card>

        {/* Fabrics */}
        {order.selectedFabrics && order.selectedFabrics.length > 0 && (
          <Card className="p-6">
            <h2 className="mb-4">Выбранные ткани</h2>
            <div className="space-y-2">
              {order.selectedFabrics.map((fabric) => (
                <div
                  key={fabric.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div>{fabric.name}</div>
                    <div className="text-sm text-gray-600">
                      {fabric.color} • {fabric.material}
                    </div>
                  </div>
                  <div>${fabric.price}/м²</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Cost */}
        {order.calculatedCost !== undefined && order.calculatedCost !== null && (
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-green-700" />
                <div>
                  <div className="text-sm text-gray-600">Предполагаемая стоимость</div>
                  <div className="text-2xl text-green-700">
                    ${order.calculatedCost.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Quick Actions */}
        {(onViewClient || onPhotoReport) && (
          <Card className="p-6">
            <h2 className="mb-4">Быстрые действия</h2>
            <div className="grid md:grid-cols-2 gap-3">
              {onViewClient && (
                <Button variant="outline" onClick={onViewClient}>
                  <UserCircle className="w-4 h-4 mr-2" />
                  Карточка клиента
                </Button>
              )}
              {onPhotoReport && (
                <Button variant="outline" onClick={onPhotoReport}>
                  <Camera className="w-4 h-4 mr-2" />
                  Фотоотчёт
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Actions */}
        <Card className="p-6">
          <h2 className="mb-4">Действия</h2>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1">
              <Edit className="w-4 h-4 mr-2" />
              Редактировать
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => {
                if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
                  onDelete(order.id);
                }
              }}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Удалить
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
