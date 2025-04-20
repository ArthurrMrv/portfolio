import React, { useState, useEffect } from 'react';
import {
    Text,
    StyleSheet,
    View,
    TouchableOpacity,
    Linking,
    useWindowDimensions,
    Link
} from 'react-native';

const SMALL_DEVICE_WIDTH = 515;

const Header = ({ title, links }) => {
    const [time, setTime] = useState(new Date());
    const { width } = useWindowDimensions();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const openLink = (link) => {
        if (link.url) {
            Linking.openURL(link.url);
        } else if (link.vcf_content) {
            const vcfContent = link.vcf_content.trim();

            const blob = new Blob([vcfContent], { type: 'text/vcard' });
            const url = URL.createObjectURL(blob);

            const link_vcf = document.createElement('a');
            link_vcf.href = url;
            link_vcf.download = 'Arthur_Morvan.vcf';
            document.body.appendChild(link_vcf);
            link_vcf.click();
            document.body.removeChild(link_vcf);

            URL.revokeObjectURL(url);

        }
    };


    const isSmallDevice = width < SMALL_DEVICE_WIDTH;
    const styles = getStyles(isSmallDevice);

    const renderLinks = () => {
        return links.map((link, index) => (
            <TouchableOpacity key={index} onPress={() => openLink(link)}>
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
            flexDirection: isSmallDevice ? 'column' : 'row',
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