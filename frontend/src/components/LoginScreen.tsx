import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Lock, AlertCircle } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [showRecovery, setShowRecovery] = useState(false);

  const handlePinChange = (value: string) => {
    const numericValue = value.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(numericValue);
    setError('');
  };

  const handleLogin = () => {
    if (pin.length < 4) {
      setError('PIN must be at least 4 digits');
      return;
    }
    // Demo: accept any PIN with 4+ digits
    onLogin();
  };

  const handleNumberClick = (num: number) => {
    if (pin.length < 6) {
      setPin(pin + num);
      setError('');
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setError('');
  };

  const handleRecovery = () => {
    setShowRecovery(true);
  };

  if (showRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-center mb-6">Восстановление ПИН-кода</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Резервная копия электронной почты</label>
              <Input type="email" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block mb-2">Имя мастера</label>
              <Input type="text" placeholder="Enter recovery phrase" />
            </div>
            <Button onClick={() => setShowRecovery(false)} className="w-full">
              Отправить код восстановления
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowRecovery(false)} 
              className="w-full"
            >
              Вернуться к входу
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-center mb-2">Введите PIN-код</h1>
          <p className="text-gray-500 text-center">
            Введите свой 4-6-значный PIN-код для доступа к приложению
          </p>
        </div>

        {/* PIN Display */}
        <div className="flex justify-center gap-3 mb-6">
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-all ${
                index < pin.length
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200'
              }`}
            >
              {index < pin.length && (
                <div className="w-3 h-3 bg-indigo-600 rounded-full" />
              )}
            </div>
          ))}
        </div>

        {error && (
          <div className="flex items-center gap-2 text-red-500 justify-center mb-4">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-16 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            onClick={handleBackspace}
            className="h-16 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
          >
            ←
          </button>
          <button
            onClick={() => handleNumberClick(0)}
            className="h-16 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-xl transition-colors"
          >
            0
          </button>
          <div className="h-16" />
        </div>

        <Button 
          onClick={handleLogin} 
          className="w-full mb-4"
          disabled={pin.length < 4}
        >
          Log In
        </Button>

        <button
          onClick={handleRecovery}
          className="w-full text-center text-indigo-600 hover:text-indigo-700 transition-colors"
        >
          Забыли свой ПИН-код?
        </button>
      </div>
    </div>
  );
}
