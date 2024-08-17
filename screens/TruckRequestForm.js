import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createOrder } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function TruckRequestForm({ navigation }) {
  const [location, setLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [noOfTrucks, setNoOfTrucks] = useState('');
  const [typeOfTruck, setTypeOfTruck] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cargoType, setCargoType] = useState('');
  const [cargoWeight, setCargoWeight] = useState('');
  const [pickupTime, setPickupTime] = useState(new Date());
  const [deliveryTime, setDeliveryTime] = useState(new Date());
  const [showPickupPicker, setShowPickupPicker] = useState(false);
  const [showDeliveryPicker, setShowDeliveryPicker] = useState(false);

  const formatDate = (date) => moment(date).format('YYYY-MM-DD HH:mm:ss');

  const handleDateChange = (event, selectedDate, setDate, setShowPicker) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'No authentication token found.');
        return;
      }

      await createOrder(
        {
          location,
          destination,
          noOfTrucks,
          typeOfTruck,
          companyName,
          cargoType,
          cargoWeight,
          pickupTime: formatDate(pickupTime),
          deliveryTime: formatDate(deliveryTime),
        },
        token
      );
      Alert.alert('Order Created', 'Your truck request has been submitted.');
      navigation.navigate('Dashboard');
    } catch (error) {
      Alert.alert('Order Failed', error.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />
      <TextInput
        style={styles.input}
        placeholder="Destination"
        value={destination}
        onChangeText={setDestination}
      />
      <TextInput
        style={styles.input}
        placeholder="Number of Trucks"
        value={noOfTrucks}
        onChangeText={setNoOfTrucks}
        inputMode="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Type of Truck (optional)"
        value={typeOfTruck}
        onChangeText={setTypeOfTruck}
      />
      <TextInput
        style={styles.input}
        placeholder="Company Name (optional)"
        value={companyName}
        onChangeText={setCompanyName}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo Type"
        value={cargoType}
        onChangeText={setCargoType}
      />
      <TextInput
        style={styles.input}
        placeholder="Cargo Weight (optional)"
        value={cargoWeight}
        onChangeText={setCargoWeight}
      />
      <br></br>
      <Button title="Select Pickup Time" onPress={() => setShowPickupPicker(true)} />
      {showPickupPicker && (
        <DateTimePicker
          value={pickupTime}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, setPickupTime, setShowPickupPicker)}
        />
      )}
      <br></br>
      <Button title="Select Delivery Time" onPress={() => setShowDeliveryPicker(true)} />
      {showDeliveryPicker && (
        <DateTimePicker
          value={deliveryTime}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={(event, date) => handleDateChange(event, date, setDeliveryTime, setShowDeliveryPicker)}
        />
      )}
      <br></br>
      <Button title="Submit Request" onPress={handleSubmit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
});
