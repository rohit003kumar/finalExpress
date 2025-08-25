


// export type OrderStatus = 'booked' | 'in progress' | 'completed' | 'cancelled';

// export interface OrderItem {
//   name?: string;
//   quantity: number;
//   price: number;
// }


// export interface Address {
//   street: string;
//   city: string;
//   state: string;
//   zip: string;
// }

// export interface Order {
//   _id: string;
//   guest?: {
//     _id: string;
//     name: string;
//     email: string;
//     contact?: string; // ✅ Add this line
//     address?: Address;
//   };
//   washerman?: {
//     _id: string;
//     name: string;
//     email?: string;
//   };
//   productId?: {
//     _id: string;
//     name?: string;
//     category?: string;
//     image?: string;
//     price?: number;
//     serviceType?: string; // ✅ Add this if you're using it
//   };
//   status: OrderStatus;
//   date: string;
//   slot?: {
//     label?: string;
//     range?: string;
//   };
//   quantity?: number;
//   totalAmount: number;
//   paymentMethod?: string;
//   paymentStatus?: string;
//   items?: OrderItem[];
//   createdAt?: string;
//   updatedAt?: string;
// }









export type OrderStatus = 'booked' | 'in progress' | 'completed' | 'cancelled';

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

export interface DeliveryAddress {
  houseNo: string;
  street: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface WashermanSummary {
  _id: string;
  name: string;
  email?: string;
}

export interface GuestUser {
  _id: string;
  name: string;
  email: string;
  contact?: string;
  address?: Address;
}

export interface OrderItem {
  serviceId: string;
  name: string;
  image?: string;
  quantity: number;
  washerman: WashermanSummary;
  category: string;
  selectedOptions: {
    _id: string;
    name: string;
    price: number;
  }[];
  price: number; // price per unit (based on selected options)
  totalPrice: number; // quantity * price
}

export interface TimeSlot {
  label?: string; // e.g., "Morning"
  range?: string; // e.g., "8:00 AM - 11:00 AM"
}

export interface Order {
  _id: string;
  guest?: GuestUser;
  washerman?: WashermanSummary;
  status: OrderStatus;
  date: string; // booking date
  slot?: TimeSlot;
  items: OrderItem[]; // ✅ multiple items
  totalAmount: number;
  quantity?: number; // optional total quantity
  paymentMethod?: string;  // e.g., "Cash", "UPI", "Card"
  paymentStatus?: string;  // e.g., "Paid", "Pending"
  deliveryAddress?: DeliveryAddress; // ✅ delivery address for washerman
  deliveryInstructions?: string; // ✅ delivery instructions
  createdAt?: string;
  updatedAt?: string;
}
