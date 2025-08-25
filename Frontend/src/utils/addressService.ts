import { apiFetch } from '../utilss/apifetch';

export interface AddressDetails {
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

export interface CustomerAddress {
  _id?: string;
  userId: string;
  address: AddressDetails;
  isDefault: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OrderAddress {
  orderId: string;
  customerAddress: AddressDetails;
  washermanId: string;
  deliveryInstructions?: string;
}

class AddressService {
  // Save customer address to backend
  async saveCustomerAddress(address: AddressDetails): Promise<CustomerAddress> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await apiFetch('/api/user/address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          address: {
            houseNo: address.houseNo,
            street: address.street,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            fullAddress: address.fullAddress,
            coordinates: address.coordinates
          },
          isDefault: true
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save address');
      }

      return await response.json();
    } catch (error) {
      console.error('Error saving customer address:', error);
      throw error;
    }
  }

  // Get customer addresses
  async getCustomerAddresses(): Promise<CustomerAddress[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await apiFetch('/api/user/addresses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch addresses');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching customer addresses:', error);
      throw error;
    }
  }

  // Send address details to washerman for order
  async sendAddressToWasherman(orderData: {
    orderId: string;
    washermanId: string;
    address: AddressDetails;
    deliveryInstructions?: string;
  }): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await apiFetch('/api/order/delivery-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          orderId: orderData.orderId,
          washermanId: orderData.washermanId,
          deliveryAddress: {
            houseNo: orderData.address.houseNo,
            street: orderData.address.street,
            landmark: orderData.address.landmark,
            city: orderData.address.city,
            state: orderData.address.state,
            pincode: orderData.address.pincode,
            fullAddress: orderData.address.fullAddress,
            coordinates: orderData.address.coordinates
          },
          deliveryInstructions: orderData.deliveryInstructions || ''
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send address to washerman');
      }

      console.log('Address sent to washerman successfully');
    } catch (error) {
      console.error('Error sending address to washerman:', error);
      throw error;
    }
  }

  // Update order with delivery address
  async updateOrderWithAddress(orderId: string, address: AddressDetails): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User not authenticated');
      }

      const response = await apiFetch(`/api/order/${orderId}/address`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          deliveryAddress: {
            houseNo: address.houseNo,
            street: address.street,
            landmark: address.landmark,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            fullAddress: address.fullAddress,
            coordinates: address.coordinates
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update order with address');
      }

      console.log('Order updated with address successfully');
    } catch (error) {
      console.error('Error updating order with address:', error);
      throw error;
    }
  }

  // Validate address format
  validateAddress(address: AddressDetails): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!address.houseNo?.trim()) {
      errors.push('House/Flat/Block No. is required');
    }

    if (!address.street?.trim()) {
      errors.push('Street/Area is required');
    }

    if (!address.city?.trim()) {
      errors.push('City is required');
    }

    if (!address.state?.trim()) {
      errors.push('State is required');
    }

    if (!address.pincode?.trim() || address.pincode.length !== 6) {
      errors.push('Valid 6-digit pincode is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Format address for display
  formatAddressForDisplay(address: AddressDetails): string {
    const parts = [
      address.houseNo,
      address.street,
      address.landmark,
      address.city,
      address.state,
      address.pincode
    ].filter(Boolean);

    return parts.join(', ');
  }

  // Get coordinates from address using geocoding
  async getCoordinatesFromAddress(address: AddressDetails): Promise<{ lat: number; lng: number } | null> {
    try {
      const fullAddress = this.formatAddressForDisplay(address);
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(fullAddress)}&key=fbddd9ac0aff4feb840edc8d63a8f264`
      );
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        return {
          lat: result.geometry.lat,
          lng: result.geometry.lng
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error getting coordinates from address:', error);
      return null;
    }
  }

  // Save address to localStorage
  saveAddressToLocalStorage(address: AddressDetails): void {
    try {
      localStorage.setItem('customerAddress', JSON.stringify(address));
    } catch (error) {
      console.error('Error saving address to localStorage:', error);
    }
  }

  // Get address from localStorage
  getAddressFromLocalStorage(): AddressDetails | null {
    try {
      const address = localStorage.getItem('customerAddress');
      return address ? JSON.parse(address) : null;
    } catch (error) {
      console.error('Error getting address from localStorage:', error);
      return null;
    }
  }

  // Clear address from localStorage
  clearAddressFromLocalStorage(): void {
    try {
      localStorage.removeItem('customerAddress');
    } catch (error) {
      console.error('Error clearing address from localStorage:', error);
    }
  }
}

export const addressService = new AddressService();
export default addressService;




