import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiService, type Order, type CreateOrderDto, type UpdateOrderDto } from '../../../services/api';

const ORDERS_QUERY_KEY = ['orders'];
const ORDER_QUERY_KEY = (id: string) => ['orders', id];

interface UseOrdersOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UseOrderOptions {
  enabled?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useOrders(options: UseOrdersOptions = {}) {
  const { onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => apiService.getOrders(),
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateOrderDto) => apiService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateOrderDto }) => 
      apiService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    orders: ordersQuery.data ?? [],
    isLoading: ordersQuery.isLoading,
    isError: ordersQuery.isError,
    error: ordersQuery.error,
    isFetching: ordersQuery.isFetching,
    refetch: ordersQuery.refetch,
    createOrder: createMutation.mutate,
    createOrderAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    createError: createMutation.error,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}

export function useOrder(id: string, options: UseOrderOptions = {}) {
  const { enabled = true, onSuccess, onError } = options;
  const queryClient = useQueryClient();

  const orderQuery = useQuery({
    queryKey: ORDER_QUERY_KEY(id),
    queryFn: () => apiService.getOrder(id),
    enabled: enabled && !!id,
    staleTime: 30000,
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateOrderDto) => apiService.updateOrder(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_QUERY_KEY(id) });
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => apiService.deleteOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
      onSuccess?.();
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  return {
    order: orderQuery.data,
    isLoading: orderQuery.isLoading,
    isError: orderQuery.isError,
    error: orderQuery.error,
    isFetching: orderQuery.isFetching,
    refetch: orderQuery.refetch,
    updateOrder: updateMutation.mutate,
    updateOrderAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updateError: updateMutation.error,
    deleteOrder: deleteMutation.mutate,
    deleteOrderAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}