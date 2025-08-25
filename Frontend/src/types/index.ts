// export interface Washerman {
//   _id: string;
//   name: string;
//   washermanId: string; // Unique identifier for the washerman
//                                                 // Add more fields if needed (e.g., email, phone)
// }

// export interface ServiceOption {
//   _id: string;
//   name: string;
//   price: number;
// }

// export interface Service {
//   _id: string;
//   name: string;
//   image: string;
//   washerman: { _id: string; name: string }; // ✅ change here
//   category: 'shirt' | 'pants' | 'suits' | 'bedding';
//   basePrice: number;
//   options?: ServiceOption[];
//   totalspent:number;
// }

// export interface CartItem {
//   serviceId: string;
//   service: Service;
//   quantity: number;
//   selectedOptions: string[];
//   totalPrice: number;
//   price: number;
//   washermanId : string; // Add washermanId to CartItem
//   washerman: Washerman; // Add washerman object to CartItem
//   name: string; // Add name to CartItem
// }

// export interface TimeSlot {
//   _id: string;
//   time: string;
//   period: 'Morning' | 'Afternoon' | 'Evening';
//   available: number;
//   total: number;
//   isAvailable: boolean;
//   maximumorder: number; // Add maximum order field
// }

// export interface Order {
//   _id: string;
//   items: CartItem[];
//   totalSpent: number;
//   selectedDate: string;
//   selectedTimeSlot: TimeSlot | null;
//   totalAmount: number;
//   status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
// }









// Washerman model
export interface Washerman {
  _id: string;
  name: string;
  washermanId: string; // Unique identifier for the washerman
  // Add more fields if needed (e.g., email, phone)
}

// Option within a service (e.g., Wash, Iron)
export interface ServiceOption {
  _id: string;
  name: string;
  price: number;
}

// Final unified Service model
export interface Service {
  _id: string;
  title?: string; // Optional title (e.g., "Shirt Premium")
  name: string;   // Internal or base name (e.g., "Shirt")
  image: string;
  washerman: Washerman; // Reference to owner washerman
  category: 'shirt' | 'pants' | 'suits' | 'bedding' | string;
  description?: string;
  options: ServiceOption[]; // Required: wash/iron/dry-clean
  basePrice?: number;       // Optional: can fallback to options' price
  totalspent?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Customer's item in the cart
export interface CartItem {
  serviceId: string;
  service: Service;
  quantity: number;
  selectedOptions: string[]; // List of selected option._id
  totalPrice: number;        // quantity * sum of selected option prices
  price: number;             // price per unit
  washermanId: string;
  washerman: Washerman;
  name: string; // Name of the service (for quick display)
}

// Time slots for booking
export interface TimeSlot {
  _id: string;
  time: string;
  period: 'Morning' | 'Afternoon' | 'Evening';
  available: number;
  total: number;
  isAvailable: boolean;
  maximumorder: number;
}

// Customer Order model
export interface Order {
  _id: string;
  items: CartItem[];
  totalSpent: number;
  selectedDate: string;
  selectedTimeSlot: TimeSlot | null;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed';
}
