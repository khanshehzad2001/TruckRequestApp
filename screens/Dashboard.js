import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { getOrders } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Dashboard({ navigation, route }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(route.params.token);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders(token);
        if (response?.data) {
          setOrders(response.data);
        } else {
          Alert.alert('No Orders', 'No orders found.');
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error.response?.data?.message || error.message);
        Alert.alert('Error', 'Failed to fetch orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Logout failed');
      }
      await AsyncStorage.removeItem('userToken');
      Alert.alert('Logout Successful', 'You have been logged out.');
      navigation.navigate('Login');
    } catch (error) {
      Alert.alert('Logout Failed', 'Failed to log out. Please try again.');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.location}</Text>
      <Text style={styles.cell}>{item.destination}</Text>
      <Text style={styles.cell}>{item.no_of_trucks}</Text>
      <Text style={styles.cell}>{item.type_of_truck || 'N/A'}</Text>
      <Text style={styles.cell}>{item.company_name || 'N/A'}</Text>
      <Text style={styles.cell}>{item.cargo_type}</Text>
      <Text style={styles.cell}>{item.cargo_weight ? `${item.cargo_weight}` : 'N/A'}</Text>
      <Text style={styles.cell}>{item.pickup_time}</Text>
      <Text style={styles.cell}>{item.delivery_time}</Text>
      <Text style={styles.cell}>{item.status}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('RequestTruck')} style={styles.requestButton}>
          <Text style={styles.requestText}>Request Truck</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>Location</Text>
        <Text style={styles.headerCell}>Destination</Text>
        <Text style={styles.headerCell}>No. of Trucks</Text>
        <Text style={styles.headerCell}>Type of Truck</Text>
        <Text style={styles.headerCell}>Company Name</Text>
        <Text style={styles.headerCell}>Cargo Type</Text>
        <Text style={styles.headerCell}>Cargo Weight</Text>
        <Text style={styles.headerCell}>Pickup Time</Text>
        <Text style={styles.headerCell}>Delivery Time</Text>
        <Text style={styles.headerCell}>Status</Text>
      </View>
      <FlatList
        data={orders}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Text style={styles.emptyText}>No orders available</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 10,
    borderRadius: 5,
  },
  requestButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  requestText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    paddingVertical: 10,
    marginBottom: 5,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: '#888',
  },
});
