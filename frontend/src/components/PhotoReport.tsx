import { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Camera,
  RotateCcw,
  Save,
  Upload,
  Wifi,
  WifiOff,
  Image as ImageIcon,
} from 'lucide-react';

interface PhotoReportProps {
  orderId: string;
  customerName: string;
  onBack: () => void;
  onSave: (data: {
    orderId: string;
    photos: string[];
    comment: string;
    timestamp: Date;
  }) => void;
}

export function PhotoReport({ orderId, customerName, onBack, onSave }: PhotoReportProps) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor online status
  useState(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  });

  const handleTakePhoto = () => {
    // In a real app, this would open the device camera
    // For demo purposes, we'll use file input
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileReaders: Promise<string>[] = [];
      
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
        fileReaders.push(promise);
      });

      Promise.all(fileReaders).then((results) => {
        setPhotos([...photos, ...results]);
      });
    }
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleRetake = (index: number) => {
    handleRemovePhoto(index);
    handleTakePhoto();
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate saving process
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reportData = {
      orderId,
      photos,
      comment,
      timestamp: new Date(),
    };

    // Save to localStorage for offline support
    const savedReports = JSON.parse(localStorage.getItem('photoReports') || '[]');
    savedReports.push(reportData);
    localStorage.setItem('photoReports', JSON.stringify(savedReports));

    if (isOnline) {
      // In a real app, this would sync to server
      console.log('Syncing to server...', reportData);
    }

    onSave(reportData);
    setIsSaving(false);
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
              <h1 className="mb-1">Фотоотчёт</h1>
              <p className="text-gray-600">{customerName}</p>
            </div>
            <Badge variant={isOnline ? 'default' : 'secondary'}>
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 mr-1" />
                  Онлайн
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 mr-1" />
                  Офлайн
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Photo Capture Section */}
        <Card className="p-6">
          <h2 className="mb-4">Фотографии</h2>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />

          {photos.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-600 mb-4">Фотографий пока нет</p>
              <Button onClick={handleTakePhoto}>
                <Camera className="w-4 h-4 mr-2" />
                Сделать фото
              </Button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                {photos.map((photo, index) => (
                  <div key={index} className="relative border rounded-lg overflow-hidden">
                    <img
                      src={photo}
                      alt={`Фото ${index + 1}`}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRetake(index)}
                          className="flex-1"
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Переснять
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleRemovePhoto(index)}
                        >
                          Удалить
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Button onClick={handleTakePhoto} variant="outline" className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Добавить ещё фото
              </Button>
            </>
          )}
        </Card>

        {/* Comment Section */}
        <Card className="p-6">
          <h2 className="mb-4">Комментарий</h2>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Установка завершена, клиент доволен. Все шторы установлены согласно замерам..."
            rows={5}
          />
          <p className="text-xs text-gray-500 mt-2">
            Опишите результат работы, особенности установки и впечатление клиента
          </p>
        </Card>

        {/* Sync Status */}
        {!isOnline && (
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start gap-3">
              <WifiOff className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <div className="text-sm text-yellow-800">
                  Нет подключения к интернету
                </div>
                <div className="text-xs text-yellow-700 mt-1">
                  Отчёт будет сохранён локально и синхронизирован при появлении подключения
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Save Button */}
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Фотографий:</span>
              <span>{photos.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Комментарий:</span>
              <span>{comment.length > 0 ? 'Добавлен' : 'Не добавлен'}</span>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Статус синхронизации:</span>
              <Badge variant={isOnline ? 'default' : 'secondary'}>
                {isOnline ? 'Готов к отправке' : 'Сохранится локально'}
              </Badge>
            </div>
            
            <Button
              onClick={handleSave}
              disabled={photos.length === 0 || isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-pulse" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить и синхронизировать
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
