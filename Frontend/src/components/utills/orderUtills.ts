



import { OrderItem, OrderStatus } from '../../types/order';

export function calculateTotal(items: OrderItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function getStatusColor(status: OrderStatus): string {
  switch (status) {
    case 'Completed':
      return 'bg-green-100 text-green-700';
    case 'In Progress':
      return 'bg-yellow-100 text-yellow-700';
    case 'Pending':
      return 'bg-blue-100 text-blue-700';
    case 'Cancelled':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
}
