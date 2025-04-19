// components/Header/Header.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Linking,
} from 'react-native';

const Header = ({ title, links }) => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const openLink = (url) => {
        Linking.openURL(url);
        
    };

    const renderLinks = () => {
        return links.map((link, index) => (
            <TouchableOpacity key={index} onPress={() => openLink(link.url)}>
                <Text style={styles.linkText}>{link.text}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <View style={styles.header}>
            <Text style={styles.headerText}>{title}</Text>
            <Text style={styles.timeText}>{time.toLocaleString()}</Text>
            <View style={styles.links}>
                {renderLinks()}
            </View>
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#00ff00',
    },
    headerText: {
        color: '#00ff00',
        fontFamily: 'Courier',
        fontSize: 20,
        fontWeight: 'bold',
    },
    timeText: {
        color: '#00ff00',
        fontFamily: 'Courier',
        fontSize: 14,
    },
    links: {
        flexDirection: 'row',
        gap: 10,
    },
    linkText: {
        color: '#00ff00',
        fontFamily: 'Courier',
        fontSize: 14,
        marginLeft: 10,
    }
});
