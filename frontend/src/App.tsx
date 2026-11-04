import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { HomeScreen } from './components/HomeScreen';
import { OrderForm } from './components/OrderForm';
import { OrderDetail } from './components/OrderDetail';
import { ClientCard } from './components/ClientCard';
import { PhotoReport } from './components/PhotoReport';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type Screen = 'login' | 'home' | 'order-form' | 'order-detail' | 'client-card' | 'photo-report';

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
  selectedCurtainRods?: any[];
  calculatedCost?: number;
  costBreakdown?: any;
}

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

// Mock initial data
const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    customerName: 'Иван Иванович',
    phone: '+7(912)345-67-89',
    address: 'ул. Удмуртская, д. 129, кв. 42',
    serviceType: 'measurement',
    date: new Date(2025, 10, 12),
    status: 'confirmed',
    time: '10:00',
  },
  {
    id: '2',
    customerName: 'Дмитрий Алексеев',
    phone: '+1 (555) 234-5678',
    address: 'ул. Пушкинская, д. 19, кв. 2',
    serviceType: 'installation',
    date: new Date(2025, 10, 9),
    status: 'not-confirmed',
    time: '14:00',
  },
  {
    id: '3',
    customerName: 'Владислав Малышев',
    phone: '+1 (555) 345-6789',
    address: 'ул. Холмогорова, д. 81, кв. 222',
    serviceType: 'tailoring',
    date: new Date(2025, 10, 15),
    status: 'confirmed',
    time: '11:30',
  },
  {
    id: '4',
    customerName: 'Марина Шестакова',
    phone: '+1 (555) 456-7890',
    address: 'ул. Родниковая, д. 56, кв. 98',
    serviceType: 'repair',
    date: new Date(2025, 10, 9),
    status: 'completed',
    time: '09:00',
  },
];

// Mock clients data
const MOCK_CLIENTS: Client[] = [
  {
    id: 'c1',
    name: 'Иван Иванович',
    phone: '+7(912)345-67-89',
    address: 'Удмуртская 129',
    notes: 'Любит бежевые тона, кошка — не цеплять низ штор',
    orders: [],
    photos: [
      {
        id: 'p1',
        url: '',
        caption: '2023 — гостиная',
        date: new Date(2023, 5, 15),
      },
    ],
  },
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      const parsed = JSON.parse(savedOrders);
      // Convert date strings back to Date objects
      const ordersWithDates = parsed.map((order: any) => ({
        ...order,
        date: new Date(order.date),
      }));
      setOrders(ordersWithDates);
    }
  }, []);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('orders', JSON.stringify(orders));
    }
  }, [orders, isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentScreen('home');
    toast.success('Welcome back!');
  };

  const handleCreateOrder = () => {
    setCurrentScreen('order-form');
  };

  const handleOrderSubmit = (orderData: any) => {
    const newOrder: Order = {
      ...orderData,
      id: Date.now().toString(),
      date: new Date(orderData.date),
      status: 'not-confirmed' as const,
    };
    setOrders([...orders, newOrder]);
    setCurrentScreen('home');
    toast.success('Order created successfully!');
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setCurrentScreen('order-detail');
  };

  const handleStatusChange = (orderId: string, status: Order['status']) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status });
    }
    toast.success('Order status updated');
  };

  const handleDeleteOrder = (orderId: string) => {
    setOrders(orders.filter((order) => order.id !== orderId));
    setCurrentScreen('home');
    toast.success('Order deleted');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedOrder(null);
    setSelectedClient(null);
  };

  const handleViewClient = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      // Find or create client
      let client = clients.find(c => c.phone === order.phone);
      if (!client) {
        client = {
          id: 'c' + Date.now(),
          name: order.customerName,
          phone: order.phone,
          address: order.address,
          notes: '',
          orders: [],
          photos: [],
        };
        setClients([...clients, client]);
      }
      
      // Update client orders
      const clientOrders = orders.filter(o => o.phone === order.phone).map(o => ({
        id: o.id,
        date: o.date,
        status: o.status,
        total: o.calculatedCost || 0,
        service: o.serviceType,
      }));
      client.orders = clientOrders;
      
      setSelectedClient(client);
      setCurrentScreen('client-card');
    }
  };

  const handleUpdateClientNotes = (notes: string) => {
    if (selectedClient) {
      const updatedClients = clients.map(c => 
        c.id === selectedClient.id ? { ...c, notes } : c
      );
      setClients(updatedClients);
      setSelectedClient({ ...selectedClient, notes });
      toast.success('Заметки обновлены');
    }
  };

  const handleScheduleVisit = () => {
    setCurrentScreen('order-form');
  };

  const handlePhotoReport = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setCurrentScreen('photo-report');
    }
  };

  const handleSavePhotoReport = (reportData: any) => {
    toast.success('Фотоотчёт сохранён');
    setCurrentScreen('order-detail');
  };

  const handleClientOrderClick = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      setSelectedOrder(order);
      setCurrentScreen('order-detail');
    }
  };

  return (
    <>
      {currentScreen === 'login' && <LoginScreen onLogin={handleLogin} />}
      
      {currentScreen === 'home' && (
        <HomeScreen
          onCreateOrder={handleCreateOrder}
          onOrderClick={handleOrderClick}
          orders={orders}
        />
      )}
      
      {currentScreen === 'order-form' && (
        <OrderForm onBack={handleBack} onSubmit={handleOrderSubmit} />
      )}
      
      {currentScreen === 'order-detail' && selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onBack={handleBack}
          onStatusChange={handleStatusChange}
          onDelete={handleDeleteOrder}
          onViewClient={() => handleViewClient(selectedOrder.id)}
          onPhotoReport={() => handlePhotoReport(selectedOrder.id)}
        />
      )}

      {currentScreen === 'client-card' && selectedClient && (
        <ClientCard
          client={selectedClient}
          onBack={handleBack}
          onScheduleVisit={handleScheduleVisit}
          onUpdateNotes={handleUpdateClientNotes}
          onOrderClick={handleClientOrderClick}
        />
      )}

      {currentScreen === 'photo-report' && selectedOrder && (
        <PhotoReport
          orderId={selectedOrder.id}
          customerName={selectedOrder.customerName}
          onBack={() => setCurrentScreen('order-detail')}
          onSave={handleSavePhotoReport}
        />
      )}
      
      <Toaster />
    </>
  );
}
