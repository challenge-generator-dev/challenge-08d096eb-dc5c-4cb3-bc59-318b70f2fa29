import { useState } from 'react';
import { OrderForm } from './components/OrderForm';
import { OrderList } from './components/OrderList';
import { useOrders } from './hooks/useOrders';
import { Order } from '../../services/api';
import './OrdersPage.scss';

export function OrdersPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const {
    orders,
    isLoading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refetch
  } = useOrders();

  const handleCreateOrder = async (data: Partial<Order>) => {
    try {
      await createOrder(data);
      setIsFormOpen(false);
      refetch();
    } catch (err) {
      console.error('Error creating order:', err);
    }
  };

  const handleUpdateOrder = async (id: string, data: Partial<Order>) => {
    try {
      await updateOrder({ id, ...data });
      setEditingOrder(null);
      refetch();
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta orden?')) {
      return;
    }
    try {
      await deleteOrder(id);
      refetch();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setIsFormOpen(false);
  };

  return (
    <div className="orders-page">
      <header className="orders-page__header">
        <h1 className="orders-page__title">Gestión de Órdenes</h1>
        <button
          className="orders-page__create-btn"
          onClick={() => setIsFormOpen(true)}
          aria-label="Crear nueva orden"
        >
          + Nueva Orden
        </button>
      </header>

      {isFormOpen && (
        <OrderForm
          onSubmit={handleCreateOrder}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
        />
      )}

      {editingOrder && (
        <OrderForm
          order={editingOrder}
          onSubmit={(data) => handleUpdateOrder(editingOrder.id, data)}
          onCancel={handleCancelEdit}
          isLoading={isLoading}
        />
      )}

      {error && (
        <div className="orders-page__error" role="alert">
          <p>Error al cargar las órdenes: {error.message}</p>
        </div>
      )}

      <OrderList
        orders={orders}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDeleteOrder}
      />
    </div>
  );
}