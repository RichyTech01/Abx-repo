import { useState } from 'react';
import AuthApi from '@/api/AuthApi';

export interface AddressSuggestion {
  address: string;
}

export interface AddressData {
  postCode: string;
  city: string;
  address: string;
}

export const useAddressAutocomplete = () => {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = async (term: string) => {
    if (!term) {
      setSuggestions([]);
      return;
    }

    try {
      setLoading(true);
      const data = await AuthApi.autocomplete(term);
      setSuggestions(data || []);
    } catch (error) {
      console.error("Autocomplete error:", error);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const extractPostcode = (address: string): string => {
    const postcodeRegex = /\b([A-Z]{1,2}[0-9][A-Z0-9]?\s?[0-9][A-Z]{2})\b/i;
    const match = address.match(postcodeRegex);
    return match ? match[1].trim() : "";
  };

  const parseAddress = (selectedAddress: string): AddressData => {
    const addressParts = selectedAddress.split(",");
    const extractedPostcode = extractPostcode(selectedAddress);
    const fallbackPostcode =
      extractedPostcode ||
      addressParts[addressParts.length - 1].trim().substring(0, 10);
    
    const extractedCity =
      addressParts.length > 2
        ? addressParts[addressParts.length - 2].trim()
        : "";

    return {
      postCode: fallbackPostcode,
      city: extractedCity,
      address: selectedAddress,
    };
  };

  const clearSuggestions = () => setSuggestions([]);

  return {
    suggestions,
    loading,
    fetchSuggestions,
    parseAddress,
    clearSuggestions,
  };
};