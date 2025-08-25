import React, { useState, useEffect } from 'react';
import AddressModal from './AddressModal';
import { addressService, AddressDetails } from '../utils/addressService';
import { toast } from 'react-hot-toast';

interface AddressIntegrationProps {
  children: React.ReactNode;
  onAddressSaved?: (address: AddressDetails) => void;
  showAddressModal?: boolean;
  onAddressModalClose?: () => void;
}

export default function AddressIntegration({
  children,
  onAddressSaved,
  showAddressModal = false,
  onAddressModalClose
}: AddressIntegrationProps) {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(showAddressModal);
  const [savedAddress, setSavedAddress] = useState<AddressDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load saved address from localStorage on component mount
    const loadSavedAddress = () => {
      const address = addressService.getAddressFromLocalStorage();
      if (address) {
        setSavedAddress(address);
      }
    };

    loadSavedAddress();
  }, []);

  useEffect(() => {
    setIsAddressModalOpen(showAddressModal);
  }, [showAddressModal]);

  const handleAddressSave = async (address: AddressDetails) => {
    setIsLoading(true);
    try {
      // Save to backend
      await addressService.saveCustomerAddress(address);
      
      // Save to localStorage
      addressService.saveAddressToLocalStorage(address);
      
      // Update local state
      setSavedAddress(address);
      
      // Close modal
      setIsAddressModalOpen(false);
      
      // Notify parent component
      if (onAddressSaved) {
        onAddressSaved(address);
      }
      
      toast.success('Address saved successfully!');
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };



  const handleAddressModalClose = () => {
    setIsAddressModalOpen(false);
    if (onAddressModalClose) {
      onAddressModalClose();
    }
  };

  const openAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  return (
    <>
      {children}
      
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={handleAddressModalClose}
        onSave={handleAddressSave}
        initialAddress={savedAddress || undefined}
      />
    </>
  );
}

// Hook to use address functionality
export const useAddress = () => {
  const [savedAddress, setSavedAddress] = useState<AddressDetails | null>(null);

  useEffect(() => {
    const address = addressService.getAddressFromLocalStorage();
    if (address) {
      setSavedAddress(address);
    }
  }, []);

  const saveAddress = async (address: AddressDetails) => {
    try {
      await addressService.saveCustomerAddress(address);
      addressService.saveAddressToLocalStorage(address);
      setSavedAddress(address);
      toast.success('Address saved successfully!');
      return true;
    } catch (error) {
      console.error('Error saving address:', error);
      toast.error('Failed to save address. Please try again.');
      return false;
    }
  };

  const sendAddressToWasherman = async (orderData: {
    orderId: string;
    washermanId: string;
    address: AddressDetails;
    deliveryInstructions?: string;
  }) => {
    try {
      await addressService.sendAddressToWasherman(orderData);
      toast.success('Address sent to washerman successfully!');
      return true;
    } catch (error) {
      console.error('Error sending address to washerman:', error);
      toast.error('Failed to send address to washerman. Please try again.');
      return false;
    }
  };

  const updateOrderAddress = async (orderId: string, address: AddressDetails) => {
    try {
      await addressService.updateOrderWithAddress(orderId, address);
      toast.success('Order address updated successfully!');
      return true;
    } catch (error) {
      console.error('Error updating order address:', error);
      toast.error('Failed to update order address. Please try again.');
      return false;
    }
  };

  return {
    savedAddress,
    saveAddress,
    sendAddressToWasherman,
    updateOrderAddress,
    addressService
  };
};




