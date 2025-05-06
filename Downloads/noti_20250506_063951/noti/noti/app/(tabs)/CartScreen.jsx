import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';

const CartScreen = () => {
  const [products, setProducts] = useState([
    { 
      id: '1', 
      name: 'Manzana', 
      quantity: 500, 
      unit: 'KG', 
      price: 1000000,
      image: require('./../../assets/images/apples.jpg')
    },
    { 
      id: '2', 
      name: 'Banana', 
      quantity: 350, 
      unit: 'KG', 
      price: 1200000,
      image: require('./../../assets/images/banana.jpg')
    },
  ]);

  const [purchaseCompleted, setPurchaseCompleted] = useState(false);

  const updateQuantity = (id, amount) => {
    setProducts(products.map(product => {
      if (product.id === id) {
        const newQuantity = product.quantity + amount;
        return {
          ...product,
          quantity: newQuantity > 0 ? newQuantity : 100,
          price: Math.round(product.price * (newQuantity / product.quantity))
        };
      }
      return product;
    }));
  };

  const removeProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
    setPurchaseCompleted(false);
  };

  const clearCart = () => {
    setProducts([]);
    setPurchaseCompleted(false);
  };

  const calculateTotal = () => {
    return products.reduce((sum, product) => sum + product.price, 0);
  };

  const handlePurchase = () => {
    if (products.length === 0) {
      Alert.alert('Error', 'No hay productos en el carrito');
      return;
    }
    setPurchaseCompleted(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>CULTIVA MARKET</Text>
      <Text style={styles.subHeader}>Carrito de compras</Text>
      
      <ScrollView style={styles.productsContainer}>
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={styles.productHeader}>
              <Image source={product.image} style={styles.productImage} />
              <Text style={styles.productName}>{product.name}</Text>
            </View>
            
            <View style={styles.quantityContainer}>
              <TouchableOpacity 
                style={[styles.quantityButton, styles.decreaseButton]}
                onPress={() => updateQuantity(product.id, -50)}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              
              <View style={styles.quantityInfo}>
                <Text style={styles.quantityLabel}>Cantidad:</Text>
                <Text style={styles.quantityValue}>{product.unit} {product.quantity}</Text>
              </View>
              
              <TouchableOpacity 
                style={[styles.quantityButton, styles.increaseButton]}
                onPress={() => updateQuantity(product.id, 50)}
              >
                <Text style={[styles.quantityButtonText, styles.increaseButtonText]}>+</Text>
              </TouchableOpacity>
            </View>
            
            <Text style={styles.price}>$ {product.price.toLocaleString()}</Text>
            
            {purchaseCompleted && (
              <View style={styles.confirmationContainer}>
                <Text style={styles.confirmationText}>Compra realizada con éxito</Text>
              </View>
            )}
            
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => removeProduct(product.id)}
              >
                <Text style={styles.actionButtonText}>Eliminar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Text style={styles.actionButtonText}>Ver detalles</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
      
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Cantidad de productos: {products.length}</Text>
        <Text style={styles.summaryText}>Total: $ {calculateTotal().toLocaleString()}</Text>
      </View>
      
      <View style={styles.footerButtons}>
        <TouchableOpacity 
          style={[styles.footerButton, styles.deleteButton]}
          onPress={clearCart}
        >
          <Text style={[styles.footerButtonText, styles.deleteButtonText]}>Eliminar todo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.footerButton, styles.buyButton]}
          onPress={handlePurchase}
        >
          <Text style={[styles.footerButtonText, styles.footerButtonTextBuy]}>Comprar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#2e7d32',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#495057',
  },
  productsContainer: {
    flex: 1,
    marginBottom: 20,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    padding: 8,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  decreaseButton: {
    backgroundColor: '#ff6b6b',
  },
  increaseButton: {
    backgroundColor: '#2e7d32',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  increaseButtonText: {
    color: 'white',
  },
  quantityInfo: {
    flex: 1,
    marginHorizontal: 15,
  },
  quantityLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  quantityValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginVertical: 10,
    textAlign: 'right',
  },
  confirmationContainer: {
    backgroundColor: '#e6f7e6',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#2e7d32',
  },
  confirmationText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingTop: 10,
    marginTop: 5,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionButtonText: {
    color: '#2e7d32',
    fontWeight: '500',
  },
  summaryContainer: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
    color: '#212529',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  footerButton: {
    flex: 1,
    padding: 12, // Reducido de 15 a 12
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48, // Altura fija para consistencia
  },
  deleteButton: {
    backgroundColor: '#f31a1a',
    marginRight: 8,
  },
  buyButton: {
    backgroundColor: '#2e7d32',
    marginLeft: 8,
  },
  footerButtonText: {
    fontWeight: 'bold',
    fontSize: 14, // Tamaño de fuente ligeramente reducido
  },
  deleteButtonText: {
    color: 'white', // Texto blanco para el botón Eliminar todo
  },
  footerButtonTextBuy: {
    color: 'white',
  },
});

export default CartScreen;