import React from 'react';
import {
  View,
  Image,
  StyleSheet,
} from 'react-native';

const APP_LOGO = require(
  '../assets/musanze-safe-market.png'
);

export default function AssetExample() {
  return (
    <View style={styles.container}>
      <Image
        source={APP_LOGO}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
});