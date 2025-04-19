import React, { useState, useRef, useEffect } from 'react';
import {
    TextInput,
    Text,
    ScrollView,
    StyleSheet,
    View,
    Platform,
    Linking,
} from 'react-native';



const Terminal = ({ folder_name, commands, error_message, welcome_message, links_to_parse = {} }) => {
    const [input, setInput] = useState('');
    const [cursorIndex, setCursorIndex] = useState(0);
    const [history, setHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1); // -1 means no history selected
    const [cursorVisible, setCursorVisible] = useState(true);

    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    const step = "\n    → ";
    const help_message =
        "Usage:" +
        step +
        Object.keys(commands)
            .map((cmd) => `${cmd} - ${commands[cmd].description || 'No description available'}`)
            .join(step);

    const parseCustomLinks = (text, linkMap) => {
        const elements = [];
        let remainingText = text;

        while (remainingText.length > 0) {
            let matchIndex = -1;
            let matchedUrl = null;

            for (const url in linkMap) {
                const index = remainingText.indexOf(url);
                if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
                    matchIndex = index;
                    matchedUrl = url;
                }
            }

            if (matchIndex === -1) {
                elements.push(<Text key={elements.length}>{remainingText}</Text>);
                break;
            }

            // Add text before the match
            if (matchIndex > 0) {
                elements.push(
                    <Text key={elements.length}>
                        {remainingText.slice(0, matchIndex)}
                    </Text>
                );
            }

            // Add the clickable link with the desired label
            elements.push(
                <Text
                    key={elements.length}
                    style={styles.link}
                    onPress={() => Linking.openURL(
                        matchedUrl.startsWith('+') ? `tel:${matchedUrl}` :
                            matchedUrl.includes('@') ? `mailto:${matchedUrl}` :
                                matchedUrl
                    )}
                >
                    {linkMap[matchedUrl]}
                </Text>
            );

            // Move past the matched URL
            remainingText = remainingText.slice(matchIndex + matchedUrl.length);
        }

        return elements;
    };


    useEffect(() => {
        const focusInput = () => inputRef.current?.focus();
        focusInput();

        if (Platform.OS === 'web') {
            const listener = () => focusInput();
            document.addEventListener('click', listener);
            return () => {
                document.removeEventListener('click', listener);
            };
        }
    }, []);

    useEffect(() => {
        const blink = setInterval(() => {
            setCursorVisible((v) => !v);
        }, 500);
        return () => clearInterval(blink);
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
    }, [history, input]);

    const handleCommand = () => {
        const command = input.toLowerCase().trim();
        const newEntry = { command: input, response: '' };

        if (command === 'clear') {
            setHistory([]);
        } else if (command === 'help') {
            newEntry.response = help_message;
            setHistory((prev) => [...prev, newEntry]);
        } else if (command in commands) {
            newEntry.response = commands[command].content || error_message;
            setHistory((prev) => [...prev, newEntry]);
        } else {
            newEntry.response = error_message;
            setHistory((prev) => [...prev, newEntry]);
        }

        setInput('');
        setCursorIndex(0);
        setHistoryIndex(-1);
    };

    useEffect(() => {
        if (Platform.OS === 'web') {
            const inputElement = inputRef.current;

            const handleKeyDown = (e) => {
                e.preventDefault(); // Prevent unwanted browser behaviors
                const key = e.key;

                if (key.length === 1 && key !== 'Enter') {
                    const newInput = input.slice(0, cursorIndex) + key + input.slice(cursorIndex);
                    setInput(newInput);
                    setCursorIndex(cursorIndex + 1);
                } else if (key === 'Backspace' && cursorIndex > 0) {
                    const newInput = input.slice(0, cursorIndex - 1) + input.slice(cursorIndex);
                    setInput(newInput);
                    setCursorIndex(cursorIndex - 1);
                } else if (key === 'ArrowLeft') {
                    if (cursorIndex > 0) setCursorIndex(cursorIndex - 1);
                } else if (key === 'ArrowRight') {
                    if (cursorIndex < input.length) setCursorIndex(cursorIndex + 1);
                } else if (key === 'ArrowUp') {
                    if (history.length > 0) {
                        const newIndex = Math.max(0, historyIndex === -1 ? history.length - 1 : historyIndex - 1);
                        setHistoryIndex(newIndex);
                        const prevCommand = history[newIndex].command;
                        setInput(prevCommand);
                        setCursorIndex(prevCommand.length);
                    }
                } else if (key === 'ArrowDown') {
                    if (history.length > 0) {
                        if (historyIndex + 1 >= history.length) {
                            setInput('');
                            setCursorIndex(0);
                            setHistoryIndex(-1);
                        } else {
                            const newIndex = Math.min(history.length - 1, historyIndex + 1);
                            const nextCommand = history[newIndex].command;
                            setHistoryIndex(newIndex);
                            setInput(nextCommand);
                            setCursorIndex(nextCommand.length);
                        }
                    }
                } else if (key === 'Enter') {
                    handleCommand();
                } else if (key === 'Tab') {
                    const typed = input.toLowerCase().trim();
                    const commandTitles = [...Object.keys(commands), "help"];
                    const matches = commandTitles.filter(cmd => cmd.startsWith(typed));

                    if (matches.length === 1) {
                        const completed = matches[0];
                        setInput(completed);
                        setCursorIndex(completed.length);
                    }
                }
            };

            inputElement?.addEventListener('keydown', handleKeyDown);
            return () => inputElement?.removeEventListener('keydown', handleKeyDown);
        }
    }, [input, cursorIndex, history, historyIndex]);

    return (
        <ScrollView
            style={styles.terminal}
            contentContainerStyle={{ paddingBottom: 20 }}
            ref={scrollRef}
            keyboardShouldPersistTaps="handled"
        >
            {history.map((entry, index) => (
                <View key={index}>
                    <Text style={styles.commandText}>{folder_name}:~$ {entry.command}</Text>
                    <Text style={styles.responseText}>{parseCustomLinks(entry.response, links_to_parse)}</Text>
                </View>
            ))}

            {/* Input line */}
            <View style={styles.inputLine}>
                <Text style={styles.commandText}>
                    {folder_name}:~$&nbsp;
                    {input.length === 0 && history.length === 0 ? (
                        <>
                            {cursorVisible ? <Text style={styles.cursor}>|</Text> : ' '}
                            <Text style={styles.placeholder}>{welcome_message}</Text>
                        </>

                    ) : (
                        <>
                            {input.slice(0, cursorIndex)}
                            {cursorVisible ? <Text style={styles.cursor}>|</Text> : ' '}
                            {input.slice(cursorIndex)}
                        </>
                    )}
                </Text>

                <TextInput
                    ref={inputRef}
                    style={styles.hiddenInput}
                    value={input}
                    caretHidden
                    autoFocus
                />

            </View>
        </ScrollView>
    );
};

export default Terminal;

const styles = StyleSheet.create({
    terminal: {
        flex: 1,
        backgroundColor: 'black',
        padding: 10,
    },
    commandText: {
        color: '#00ff00',
        fontFamily: 'Courier',
        fontSize: 16,
        flexWrap: 'wrap',
    },
    responseText: {
        color: '#00ff00',
        fontFamily: 'Courier',
        marginBottom: 10,
        fontSize: 16,
    },
    inputLine: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
    },
    cursor: {
        color: '#00ff00',
        fontWeight: 'bold',
    },
    hiddenInput: {
        height: 0,
        width: 0,
        opacity: 0,
        position: 'absolute',
        zIndex: -1,
    },
    placeholder: {
        opacity: 0.5,
    },
    link: {
        fontStyle: 'italic',
        cursor: 'pointer', // for web
        textDecorationLine: "underline",
    },


});
