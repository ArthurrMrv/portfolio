import React, { useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Linking,
    useWindowDimensions,
} from 'react-native';

const SMALL_DEVICE_WIDTH = 515;

const Header = ({ title, links }) => {
    const [time, setTime] = useState(new Date());
    const { width } = useWindowDimensions();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const openLink = (url) => {
        Linking.openURL(url);
    };

    const isSmallDevice = width < SMALL_DEVICE_WIDTH;
    const styles = getStyles(isSmallDevice);

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

const getStyles = (isSmallDevice) =>
    StyleSheet.create({
        header: {
            flexDirection:  isSmallDevice ? 'column' : 'row',
            paddingHorizontal: 10,
            paddingBottom: 5,
            alignItems: isSmallDevice ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            borderBottomWidth: 1,
            borderBottomColor: '#00ff00',
        },
        headerText: {
            color: '#00ff00',
            fontFamily: 'Courier',
            fontSize: isSmallDevice ? 18 : 20,
            fontWeight: 'bold',
        },
        timeText: {
            color: '#00ff00',
            fontFamily: 'Courier',
            fontSize: isSmallDevice ? 14 : 14,
            marginTop: isSmallDevice ? 4 : 0,
        },
        links: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 8,
            gap: 10,
        },
        linkText: {
            color: '#00ff00',
            fontFamily: 'Courier',
            fontSize: isSmallDevice ? 14 : 14,
            marginRight: 10,
            marginBottom: 5,

        },
    });