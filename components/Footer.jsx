import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Made with ❤️ and ☕</Text>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#00ff00',
    marginTop: 10,
  },
  text: {
    color: '#00ff00',
    fontFamily: 'Courier',
    fontSize: 14,
  },
});
