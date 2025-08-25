import { Service, TimeSlot } from '../types';

export const services: Service[] = [
  {
    _id: 'cutton-shirt',
    name: 'Cuttton Shirt',
    image: 'src/shirt.png',
    washerman: 'Rajkishor Das',
    category: 'shirt',
    basePrice: 0,
    options: [
      { id: 'express', name: 'Wash & Fold', price: 15 },
      { id: 'eco', name: 'Only Press', price: 10 }
    ]
  },
  {
    _id: 'premium-shirt',
    name: 'Premium Shirt',
    image: 'src/shirt.png',
    washerman: 'Murli Naik',
    category: 'shirt',
    basePrice: 0,
    options: [
      { id: 'starch', name: 'Dry Clean', price: 20 },
      { id: 'fold', name: 'Wash & Fold', price: 15 },
      { id: 'fold', name: 'Only Press', price: 15 }
    ]
  },
  {
    _id: 'delicate-suit',
    name: 'Delicate Suit Care',
    image: 'src/jackets.png',
    washerman: 'Binit Naik',
    category: 'suits',
    basePrice: 0,
    options: [
      { id: 'dry-clean', name: 'Dry Cleaning Only', price: 50 },
      { id: 'press', name: 'Only Press', price: 30 }
    ]
  },
  {
    _id: 'cutton-pants',
    name: 'Cutton Pants',
    image: 'src/pant.png',
    washerman: 'Murli Naik',
    category: 'pants',
    basePrice: 0,
    options: [
      { id: 'crease', name: 'Wash & Fold', price: 20 },
      { id: 'stain', name: 'Only Press', price: 25 }
    ]
  },
    {
    _id: 'bedding-pillow cover',
    name: 'Pillow Cover',
    image: 'src/pillow cover.png',
    washerman: 'Satya Sagar',
    category: 'bedding',
    basePrice: 0,
    options: [
      { id: 'crease', name: 'Wash & Fold', price: 20 }
     
    ]
  },
  {
    _id: 'bedding-bedsheet',
    name: 'Bedsheet',
    image: 'src/bedsheet.png',
    washerman: 'Satya Sagar',
    category: 'bedding',
    basePrice: 0,
    options: [
      { id: 'wash-fold', name: 'Wash & Fold', price: 600 }
     
    ]
  }
];

export const timeSlots: TimeSlot[] = [
  { id: 'morning-1', time: '09:00 - 10:00', period: 'Morning', available: 3, total: 10, isAvailable: true },
  { id: 'morning-2', time: '10:00 - 11:00', period: 'Morning', available: 0, total: 10, isAvailable: false },
  { id: 'morning-3', time: '11:00 - 12:00', period: 'Morning', available: 5, total: 10, isAvailable: true },
  { id: 'afternoon-1', time: '13:00 - 14:00', period: 'Afternoon', available: 2, total: 10, isAvailable: true },
  { id: 'afternoon-2', time: '14:00 - 15:00', period: 'Afternoon', available: 0, total: 10, isAvailable: false },
  { id: 'evening-1', time: '15:00 - 16:00', period: 'Evening', available: 6, total: 10, isAvailable: true },
  { id: 'evening-2', time: '16:00 - 17:00', period: 'Evening', available: 9, total: 10, isAvailable: true }
];