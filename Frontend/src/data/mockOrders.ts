import { Order } from '../types/order';

// Mock order data
export const mockOrders: Order[] = [
  {
    id: 'ORD123',
    name:'washer man - Hari Sankar',
    date: '2025-05-28',
    items: [{ type: 'Shirt - wash & fold', quantity: 3, pricePerItem: 30 }],
    status: 'Delivered',
    picture: 'src/shirt.png',
  },
  {
    id: 'ORD124',
    date: '2025-05-25',
    name:'washer man - soumya shaoo',
    items: [{ type: 'Jacket - Dry Clean', quantity: 1, pricePerItem: 100 }],
    status: 'In Progress',
    picture: 'src/jackets.png',
  },
  {
    id: 'ORD125',
    name:'washer man - Raju',
    date: '2025-05-20',
    items: [{ type: 'Jeans - only ironing', quantity: 1, pricePerItem: 60 }],
    status: 'Delivered',
    picture: 'src/pant.png',
  },
  {
    id: 'ORD126',
    name:'washer man - Hari Sankar',
    date: '2025-05-18',
    items: [{ type: 'Socks - Wash', quantity: 6, pricePerItem: 10 }],
    status: 'Cancelled',
    picture: 'src/sockes.png',
  },
  {
    id: 'ORD127',
    name:'washer man - Ravi Kumar',
    date: '2025-05-15',
    items: [{ type: 'Bedsheet - Wash & Fold', quantity: 3, pricePerItem: 40 }],
    status: 'Delivered',
    picture: 'src/bedsheet.png',
  },
  {
    id: 'ORD128',
    name:'washer man - Sita Devi',
    date: '2025-05-12',
    items: [{ type: 'Pillow Cover -  Wash & Fold', quantity: 8, pricePerItem: 8 }],
    status: 'Delivered',
    picture: 'src/pillow cover.png',
  },
  {
    id: 'ORD129',
    name:'washer man - Ramesh',
    date: '2025-05-10',
    items: [{ type: 'Shorts -  Wash & Fold', quantity: 3, pricePerItem: 25 }],
    status: 'In Progress',
    picture: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
  {
    id: 'ORD130',
    name:'washer man - Anita Sharma',
    date: '2025-05-08',
    items: [{ type: 'Scarf - Wash', quantity: 3, pricePerItem: 15 }],
    status: 'Delivered',
    picture: 'src/scrafe.png',
  },
  {
    id: 'ORD131',
    name:'washer man - Aju das',
    date: '2025-05-05',
    items: [{ type: 'Coat - Dry Clean', quantity: 1, pricePerItem: 120 }],
    status: 'Delivered',
    picture: 'src/jackets.png',
  },
  {
    id: 'ORD132',
    name:'washer man - piyush',
    date: '2025-05-02',
    items: [{ type: 'Towel -  Wash & Fold', quantity: 6, pricePerItem: 12 }],
    status: 'Delivered',
    picture: 'https://images.pexels.com/photos/4210341/pexels-photo-4210341.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
  },
];

export const getEnhancedMockOrders = (): Order[] => {
  // Add a delay to simulate API call
  return mockOrders.map((order, index) => {
    // Add name to the first two orders if they don't have one
    if (index < 2 && !order.name) {
      return { ...order, name: 'John Doe' };
    }
    return order;
  });
};