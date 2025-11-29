import React, { createContext, useContext, useState } from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { useThemedStyles } from "@/theme/useThemedStyles";

// Options passed when showing a confirmation dialog
type ConfirmOptions = {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
};

// Context type exposes a single method to trigger the dialog
type ConfirmContextType = {
    showConfirm: (options: ConfirmOptions) => void;
};

// Create context for confirmation handling
const ConfirmContext = createContext<ConfirmContextType | undefined>(undefined);

// Hook to access confirmation context
export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used inside ConfirmProvider");
    return ctx;
}

// Provider wraps app and renders modal when triggered
export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const { theme, styles } = useThemedStyles();

    // State for modal visibility and current options
    const [visible, setVisible] = useState(false);
    const [options, setOptions] = useState<ConfirmOptions | null>(null);

    // Show modal with provided options
    const showConfirm = (opts: ConfirmOptions) => {
        setOptions(opts);
        setVisible(true);
    };

    // Handle confirm action and close modal
    const handleConfirm = () => {
        if (options?.onConfirm) options.onConfirm();
        setVisible(false);
    };

    return (
        <ConfirmContext.Provider value={{ showConfirm }}>
            {children}
            {/* Confirmation modal */}
            <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
                <View style={styles.overlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.backgroundDark }]}>
                        {/* Title + message */}
                        <Text style={styles.title}>{options?.title}</Text>
                        <Text style={{ color: theme.text }}>{options?.message}</Text>

                        {/* Action buttons */}
                        <View style={{ flexDirection: "row", justifyContent: "space-around", marginTop: 15 }}>
                            <TouchableOpacity style={styles.Button} onPress={() => setVisible(false)}>
                                <Text style={styles.btnText}>{options?.cancelText ?? "Cancel"}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.logoutButton} onPress={handleConfirm}>
                                <Text style={styles.btnText}>{options?.confirmText ?? "OK"}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </ConfirmContext.Provider>
    );
}