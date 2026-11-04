import { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Image as ImageIcon,
  Plus,
  Edit2,
  Save,
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
  orders: Array<{
    id: string;
    date: Date;
    status: string;
    total: number;
    service: string;
  }>;
  photos: Array<{
    id: string;
    url: string;
    caption: string;
    date: Date;
  }>;
}

interface ClientCardProps {
  client: Client;
  onBack: () => void;
  onScheduleVisit: () => void;
  onUpdateNotes: (notes: string) => void;
  onOrderClick: (orderId: string) => void;
}

export function ClientCard({ client, onBack, onScheduleVisit, onUpdateNotes, onOrderClick }: ClientCardProps) {
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [notes, setNotes] = useState(client.notes);

  const handleSaveNotes = () => {
    onUpdateNotes(notes);
    setIsEditingNotes(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-confirmed':
        return 'bg-red-100 text-red-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'not-confirmed':
        return 'Не подтверждён';
      case 'confirmed':
        return 'Подтверждён';
      case 'completed':
        return 'Завершён';
      default:
        return status;
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
              <h1 className="mb-1">Карточка клиента</h1>
              <p className="text-gray-600">{client.name}</p>
            </div>
            <Button onClick={onScheduleVisit}>
              <Calendar className="w-4 h-4 mr-2" />
              Назначить выезд
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Contact Information */}
        <Card className="p-6">
          <h2 className="mb-4">Контактная информация</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">ФИО</div>
                <div>{client.name}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Телефон</div>
                <div>{client.phone}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Адрес</div>
                <div>{client.address}</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2>Заметки</h2>
            {!isEditingNotes ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditingNotes(true)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Редактировать
              </Button>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={handleSaveNotes}
              >
                <Save className="w-4 h-4 mr-2" />
                Сохранить
              </Button>
            )}
          </div>
          {isEditingNotes ? (
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Любит бежевые тона, кошка — не цеплять низ штор"
              rows={4}
            />
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg text-sm">
              {notes || 'Нет заметок'}
            </div>
          )}
        </Card>

        {/* Order History */}
        <Card className="p-6">
          <h2 className="mb-4">История заказов</h2>
          <div className="space-y-3">
            {client.orders.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>Заказов пока нет</p>
              </div>
            ) : (
              client.orders.map((order) => (
                <button
                  key={order.id}
                  onClick={() => onOrderClick(order.id)}
                  className="w-full p-4 border rounded-lg hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="mb-1">{order.service}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(order.date).toLocaleDateString('ru-RU')}
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusLabel(order.status)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-gray-400" />
                    <span>{order.total.toLocaleString('ru-RU')} ₽</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Photo Gallery */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2>Фотографии установок</h2>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Добавить фото
            </Button>
          </div>
          {client.photos.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Фотографий пока нет</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {client.photos.map((photo) => (
                <div key={photo.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-video bg-gray-100 flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                  <div className="p-3">
                    <div className="text-sm">{photo.caption}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(photo.date).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Всего заказов</div>
            <div className="text-3xl">{client.orders.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Завершено</div>
            <div className="text-3xl text-green-600">
              {client.orders.filter(o => o.status === 'completed').length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-1">Общая сумма</div>
            <div className="text-3xl text-indigo-600">
              {client.orders.reduce((sum, o) => sum + o.total, 0).toLocaleString('ru-RU')} ₽
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
