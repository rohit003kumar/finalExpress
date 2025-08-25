// export interface Service {
//   _id: string;
//   title: string;
//   name: string;
//   category: string;
//   serviceType: string;
//   price: number;
//   description: string;
//   image: string;
//   createdAt: string;
//   updatedAt: string;
// }



export interface ServiceOption {
  _id: string;
  name: string; // e.g., "Wash", "Iron", "Dry-Clean"
  price: number;
}

export interface Service {
  _id: string;
  title?: string; // Optional display title (can be same as name)
  name: string;   // Base service name, e.g., "Shirt"
  image: string;
  washerman: { _id: string; name: string }; // Washerman who created this service
  category: 'shirt' | 'pants' | 'suits' | 'bedding' | string;
  description?: string;
  basePrice?: number; // Optional fallback if no options
  options: ServiceOption[]; // ✅ array of service types with prices
  totalspent?: number;
  createdAt?: string;
  updatedAt?: string;
}

