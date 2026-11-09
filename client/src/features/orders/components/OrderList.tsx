import { Order } from '../../types';
import './OrderList.scss';

interface OrderListProps {
  orders: Order[];
  isLoading: boolean;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente',
  CONFIRMED: 'Confirmado',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado'
};

const STATUS_CLASSES: Record<string, string> = {
  PENDING: 'status--pending',
  CONFIRMED: 'status--confirmed',
  SHIPPED: 'status--shipped',
  DELIVERED: 'status--delivered',
  CANCELLED: 'status--cancelled'
};

const STATUS_ICONS: Record<string, string> = {
  PENDING: '⏳',
  CONFIRMED: '✓',
  SHIPPED: '📦',
  DELIVERED: '✅',
  CANCELLED: '❌'
};

const STATUS_PRIORITY: Record<string, number> = {
  PENDING: 1,
  CONFIRMED: 2,
  SHIPPED: 3,
  DELIVERED: 4,
  CANCELLED: 5
};

type SortField = 'id' | 'customerName' | 'customerEmail' | 'total' | 'status' | 'createdAt' | 'updatedAt';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

export function OrderList({ orders, isLoading, onEdit, onDelete }: OrderListProps) {
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    field: 'createdAt',
    direction: 'desc'
  });
  const [filterStatus, setFilterStatus] = React.useState<string>('ALL');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const filteredOrders = React.useMemo(() => {
    let result = [...orders];
    
    if (filterStatus !== 'ALL') {
      result = result.filter(order => order.status === filterStatus);
    }
    
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        order =>
          order.customerName.toLowerCase().includes(term) ||
          order.customerEmail.toLowerCase().includes(term) ||
          order.id.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [orders, filterStatus, searchTerm]);

  const sortedOrders = React.useMemo(() => {
    const sorted = [...filteredOrders];
    sorted.sort((a, b) => {
      let aVal: string | number = '';
      let bVal: string | number = '';
      
      switch (sortConfig.field) {
        case 'id':
        case 'customerName':
        case 'customerEmail':
          aVal = String(a[sortConfig.field] || '').toLowerCase();
          bVal = String(b[sortConfig.field] || '').toLowerCase();
          break;
        case 'total':
          aVal = a.total || 0;
          bVal = b.total || 0;
          break;
        case 'status':
          aVal = STATUS_PRIORITY[a.status] || 0;
          bVal = STATUS_PRIORITY[b.status] || 0;
          break;
        case 'createdAt':
        case 'updatedAt':
          aVal = a[sortConfig.field] ? new Date(a[sortConfig.field]!).getTime() : 0;
          bVal = b[sortConfig.field] ? new Date(b[sortConfig.field]!).getTime() : 0;
          break;
      }
      
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredOrders, sortConfig]);

  const handleSort = (field: SortField) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIndicator = (field: SortField): string => {
    if (sortConfig.field !== field) return '';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (isLoading) {
    return (
      <div className="order-list__loading">
        <div className="order-list__spinner" aria-label="Cargando órdenes">
          <div className="order-list__spinner-circle"></div>
        </div>
        <p>Cargando órdenes...</p>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="order-list__empty">
        <div className="order-list__empty-icon" aria-hidden="true">
          📋
        </div>
        <h3 className="order-list__empty-title">No hay órdenes</h3>
        <p className="order-list__empty-text">
          Crea tu primera orden usando el botón "Nueva Orden"
        </p>
      </div>
    );
  }

  const formatDate = (dateString?: string): string => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount?: number): string => {
    if (amount === undefined || amount === null) return '-';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la orden ${id}?`)) {
      onDelete(id);
    }
  };

  return (
    <div className="order-list">
      <div className="order-list__controls">
        <div className="order-list__search">
          <input
            type="text"
            placeholder="Buscar por cliente, email o ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="order-list__search-input"
            aria-label="Buscar órdenes"
          />
        </div>
        <div className="order-list__filter">
          <label htmlFor="status-filter" className="order-list__filter-label">
            Filtrar por estado:
          </label>
          <select
            id="status-filter"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="order-list__filter-select"
          >
            <option value="ALL">Todos</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>
        <div className="order-list__summary">
          <span className="order-list__summary-count">
            {sortedOrders.length} de {orders.length} órdenes
          </span>
        </div>
      </div>

      <table className="order-list__table" role="grid" aria-label="Lista de órdenes">
        <thead className="order-list__thead">
          <tr>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('id')}
              aria-sort={sortConfig.field === 'id' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              ID{getSortIndicator('id')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('customerName')}
              aria-sort={sortConfig.field === 'customerName' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Cliente{getSortIndicator('customerName')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('customerEmail')}
              aria-sort={sortConfig.field === 'customerEmail' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Email{getSortIndicator('customerEmail')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('total')}
              aria-sort={sortConfig.field === 'total' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Total{getSortIndicator('total')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('status')}
              aria-sort={sortConfig.field === 'status' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Estado{getSortIndicator('status')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('createdAt')}
              aria-sort={sortConfig.field === 'createdAt' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Fecha Creación{getSortIndicator('createdAt')}
            </th>
            <th 
              scope="col" 
              className="order-list__th order-list__th--sortable"
              onClick={() => handleSort('updatedAt')}
              aria-sort={sortConfig.field === 'updatedAt' ? (sortConfig.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
            >
              Fecha Actualización{getSortIndicator('updatedAt')}
            </th>
            <th scope="col" className="order-list__th">Acciones</th>
          </tr>
        </thead>
        <tbody className="order-list__tbody">
          {sortedOrders.map((order) => (
            <tr key={order.id} className="order-list__tr">
              <td className="order-list__td order-list__td--id">
                <code className="order-list__code">{order.id}</code>
              </td>
              <td className="order-list__td">{order.customerName}</td>
              <td className="order-list__td">{order.customerEmail}</td>
              <td className="order-list__td order-list__td--number">
                {formatCurrency(order.total)}
              </td>
              <td className="order-list__td">
                <span
                  className={`order-list__status ${STATUS_CLASSES[order.status] || 'status--default'}`}
                >
                  <span className="order-list__status-icon" aria-hidden="true">
                    {STATUS_ICONS[order.status] || '●'}
                  </span>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
              </td>
              <td className="order-list__td order-list__td--date">
                {formatDate(order.createdAt)}
              </td>
              <td className="order-list__td order-list__td--date">
                {formatDate(order.updatedAt)}
              </td>
              <td className="order-list__td order-list__td--actions">
                <div className="order-list__actions">
                  <button
                    className="order-list__btn order-list__btn--edit"
                    onClick={() => onEdit(order)}
                    aria-label={`Editar orden ${order.id}`}
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    className="order-list__btn order-list__btn--delete"
                    onClick={() => handleDeleteClick(order.id)}
                    aria-label={`Eliminar orden ${order.id}`}
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

import * as React from 'react';