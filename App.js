import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
} from 'react-native';

import Header from './components/Header.jsx';
import Terminal from './components/Terminal.jsx';
import data from './Data.json'; // Assuming you have a data.json file
import Footer from './components/Footer.jsx';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Header
        title={data.title}
        links={data.links}
      />

      <Terminal
        folder_name={data.terminal.folder_name}
        commands={data.terminal.commands}
        error_message={data.terminal.error_message}
        welcome_message={data.terminal.welcome_message}
        links_to_parse={data.links_to_parse}
      />

      <Footer />

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 40,
  }
});
