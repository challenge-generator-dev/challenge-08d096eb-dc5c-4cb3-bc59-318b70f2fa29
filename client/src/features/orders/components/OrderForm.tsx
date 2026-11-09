import { useState, useEffect } from 'react';
import { Order } from '../../types';
import './OrderForm.scss';

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: Partial<Order>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const STATUS_OPTIONS: OrderStatus[] = [
  'PENDING',
  'CONFIRMED',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED'
];

export function OrderForm({ order, onSubmit, onCancel, isLoading }: OrderFormProps) {
  const [formData, setFormData] = useState({
    customerName: order?.customerName || '',
    customerEmail: order?.customerEmail || '',
    total: order?.total?.toString() || '',
    status: order?.status || 'PENDING' as OrderStatus
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (order) {
      setFormData({
        customerName: order.customerName || '',
        customerEmail: order.customerEmail || '',
        total: order.total?.toString() || '',
        status: order.status || 'PENDING'
      });
    }
  }, [order]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'El nombre del cliente es obligatorio';
    } else if (formData.customerName.trim().length < 2) {
      newErrors.customerName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'El email del cliente es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'El email debe tener un formato válido';
    }

    const totalValue = parseFloat(formData.total);
    if (!formData.total || isNaN(totalValue)) {
      newErrors.total = 'El total es obligatorio';
    } else if (totalValue < 0) {
      newErrors.total = 'El total no puede ser negativo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        customerName: formData.customerName.trim(),
        customerEmail: formData.customerEmail.trim(),
        total: parseFloat(formData.total),
        status: formData.status
      });
    } catch (err) {
      console.error('Error submitting form:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="order-form-overlay">
      <form className="order-form" onSubmit={handleSubmit} noValidate>
        <h2 className="order-form__title">
          {order ? 'Editar Orden' : 'Crear Nueva Orden'}
        </h2>

        <div className="order-form__field">
          <label htmlFor="customerName" className="order-form__label">
            Nombre del Cliente
          </label>
          <input
            id="customerName"
            name="customerName"
            type="text"
            value={formData.customerName}
            onChange={handleChange}
            className={`order-form__input ${errors.customerName ? 'order-form__input--error' : ''}`}
            disabled={isSubmitting}
            aria-invalid={!!errors.customerName}
            aria-describedby={errors.customerName ? 'customerName-error' : undefined}
          />
          {errors.customerName && (
            <span id="customerName-error" className="order-form__error" role="alert">
              {errors.customerName}
            </span>
          )}
        </div>

        <div className="order-form__field">
          <label htmlFor="customerEmail" className="order-form__label">
            Email del Cliente
          </label>
          <input
            id="customerEmail"
            name="customerEmail"
            type="email"
            value={formData.customerEmail}
            onChange={handleChange}
            className={`order-form__input ${errors.customerEmail ? 'order-form__input--error' : ''}`}
            disabled={isSubmitting}
            aria-invalid={!!errors.customerEmail}
            aria-describedby={errors.customerEmail ? 'customerEmail-error' : undefined}
          />
          {errors.customerEmail && (
            <span id="customerEmail-error" className="order-form__error" role="alert">
              {errors.customerEmail}
            </span>
          )}
        </div>

        <div className="order-form__field">
          <label htmlFor="total" className="order-form__label">
            Total
          </label>
          <input
            id="total"
            name="total"
            type="number"
            step="0.01"
            min="0"
            value={formData.total}
            onChange={handleChange}
            className={`order-form__input ${errors.total ? 'order-form__input--error' : ''}`}
            disabled={isSubmitting}
            aria-invalid={!!errors.total}
            aria-describedby={errors.total ? 'total-error' : undefined}
          />
          {errors.total && (
            <span id="total-error" className="order-form__error" role="alert">
              {errors.total}
            </span>
          )}
        </div>

        <div className="order-form__field">
          <label htmlFor="status" className="order-form__label">
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="order-form__select"
            disabled={isSubmitting}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="order-form__actions">
          <button
            type="button"
            className="order-form__btn order-form__btn--cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="order-form__btn order-form__btn--submit"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? 'Guardando...' : order ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
}