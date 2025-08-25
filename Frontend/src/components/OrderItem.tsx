



import { OrderItem } from '../types/order';

interface Props {
  item: OrderItem;
}

export default function OrderItemComponent({ item }: Props) {
  return (
    <div className="flex justify-between text-sm text-gray-700">
      <span>{item.name} x{item.quantity}</span>
      <span>₹{item.price * item.quantity}</span>
    </div>
  );
}
