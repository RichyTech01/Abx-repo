// components/AddressAutocompleteInput.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CustomTextInput from '@/common/CustomTextInput';
import { useAddressAutocomplete, AddressData } from '@/hooks/useAddressAutocomplete';

interface AddressAutocompleteInputProps {
  postCodeValue: string;
  cityValue: string;
  addressValue: string;
  onAddressChange: (addressData: AddressData) => void;
  onPostCodeChange: (postCode: string) => void;
  errors?: {
    postCode?: string;
    city?: string;
    address?: string;
  };
  postCodeLabel?: string;
  cityLabel?: string;
  addressLabel?: string;
  postCodePlaceholder?: string;
  cityPlaceholder?: string;
  addressPlaceholder?: string;
}

export default function AddressAutocompleteInput({
  postCodeValue,
  cityValue,
  addressValue,
  onAddressChange,
  onPostCodeChange,
  errors = {},
  postCodeLabel = "Post code",
  cityLabel = "City",
  addressLabel = "Home Address",
  postCodePlaceholder = "Type your post code",
  cityPlaceholder = "Enter your city",
  addressPlaceholder = "Clearly state your address",
}: AddressAutocompleteInputProps) {
  const { suggestions, fetchSuggestions, parseAddress, clearSuggestions } = useAddressAutocomplete();

  const handlePostCodeChange = (text: string) => {
    const limitedText = text.substring(0, 10);
    onPostCodeChange(limitedText);
    fetchSuggestions(limitedText);
  };

  const handleSelectSuggestion = (selectedAddress: string) => {
    const addressData = parseAddress(selectedAddress);
    onAddressChange(addressData);
    clearSuggestions();
  };

  return (
    <View style={styles.container}>
      {/* Post Code Input */}
      <CustomTextInput
        label={postCodeLabel}
        placeholder={postCodePlaceholder}
        value={postCodeValue}
        onChangeText={handlePostCodeChange}
        error={errors.postCode}
      />

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <View style={styles.suggestionsContainer}>
          {suggestions.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSelectSuggestion(item.address)}
              style={styles.suggestionItem}
            >
              <Text style={styles.suggestionText}>
                {item.address}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* City Input */}
      <CustomTextInput
        label={cityLabel}
        placeholder={cityPlaceholder}
        value={cityValue}
        onChangeText={(text) => onAddressChange({
          postCode: postCodeValue,
          city: text,
          address: addressValue,
        })}
        error={errors.city}
      />

      {/* Address Input */}
      <CustomTextInput
        label={addressLabel}
        placeholder={addressPlaceholder}
        value={addressValue}
        onChangeText={(text) => onAddressChange({
          postCode: postCodeValue,
          city: cityValue,
          address: text,
        })}
        error={errors.address}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    position: 'relative',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 65,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F1EAE7',
    borderRadius: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  suggestionItem: {
    padding: 10,
  },
  suggestionText: {
    fontSize: 12,
    color: '#2D2220',
    lineHeight: 16,
  },
});