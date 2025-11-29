import React, { createContext, useContext, useState } from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '@/theme/useThemedStyles';
import { getAuthErrorMessage } from './ErrorMessages';

// Types of alerts supported
type AlertType = 'error' | 'success';

// Context API exposes methods for showing error/success messages
type ErrorContextType = {
    showError: (error: any) => void;   // legacy API for errors
    showSuccess: (message: string) => void; // new API for success
};

// Create context for error handling
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Hook to access error context
export function useError() {
    const ctx = useContext(ErrorContext);
    if (!ctx) throw new Error('useError must be used inside ErrorProvider');
    return ctx;
}

// Provider wraps app and renders modal when triggered
export function ErrorProvider({ children }: { children: React.ReactNode }) {
    const { theme, styles } = useThemedStyles();

    // State for modal visibility, message text, and alert type
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<AlertType>('error');

    // Show error modal (string or Firebase error object)
    const showError = (error: any) => {
        const msg = typeof error === 'string' ? error : getAuthErrorMessage(error);
        setMessage(msg);
        setType('error');
        setVisible(true);
    };

    // Show success modal with custom message
    const showSuccess = (msg: string) => {
        setMessage(msg);
        setType('success');
        setVisible(true);
    };

    return (
        <ErrorContext.Provider value={{ showError, showSuccess }}>
            {children}
            {/* Error/Success modal */}
            <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.backgroundDark }]}>
                        {/* Title reflects alert type */}
                        <Text style={styles.title}>
                            {type === 'error' ? 'Error' : 'Success'}
                        </Text>
                        {/* Message body */}
                        <Text style={{ color: theme.text }}>
                            {message}
                        </Text>
                        {/* Single dismiss button */}
                        <View style={{ alignItems: "center", marginTop: 15 }}>
                            <TouchableOpacity style={styles.Button} onPress={() => setVisible(false)}>
                                <Text style={styles.btnText}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ErrorContext.Provider>
    );
}
