// useThemedStyles.ts
import { useColorScheme } from "@/components/useColorScheme";
import { StyleSheet } from "react-native";

// Theme definitions
const lightTheme = {
    text: "#000000",
    backgroundLight: "#ffffff",
    backgroundMedium: "#F7F7F7",
    backgroundDark: "#E7E6E9",
    accent: "#0170FE",
    shadow: "grey",
    placeholderColor: "#4d4d4dff",
};

const darkTheme = {
    text: "#FFFFFF",
    backgroundLight: "#323741",
    backgroundMedium: "#262C35",
    backgroundDark: "#1B2028",
    accent: "#0A84FF",
    shadow: "#000000",
    placeholderColor: "#bebebeff",
};

// Hook that returns themed styles + theme object
export const useThemedStyles = () => {
    const scheme = useColorScheme();
    const theme = scheme === "dark" ? darkTheme : lightTheme;

    const styles = StyleSheet.create({
        taskCard: {
            backgroundColor: theme.backgroundLight,
            marginTop: 15,
            padding: 10,
            width: "90%",
            borderRadius: 20,
            height: 150,
            overflow: 'hidden',

            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
        },
        cardFade: {
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 40,
            zIndex: 10,
        },
        cardTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: theme.text,
        },
        text: {
            color: theme.text,
            fontWeight: "600",
            borderColor: theme.text
        },
        btnText: {
            textAlign: "center",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: "600",
        },
        bigButton: {
            margin: 10,
            width: 300,
            backgroundColor: theme.backgroundMedium,
            padding: 20,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
        },
        Button: {
            margin: 10,
            width: 150,
            backgroundColor: theme.accent,
            padding: 20,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: theme.accent,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
        },
        titleInput: {
            color: theme.text,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
            backgroundColor: theme.backgroundLight,
            width: "80%",
            borderRadius: 20,
            padding: 20,
            margin: 20,
        },
        contentInput: {
            color: theme.text,
            width: "80%",
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
            borderColor: "lightgrey",
            backgroundColor: theme.backgroundLight,
            minHeight: 200,
            borderRadius: 20,
            textAlignVertical: "top",
            padding: 20,
        },
        checklistView: {
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
            borderColor: "lightgrey",
            backgroundColor: theme.backgroundLight,
            borderRadius: 20,
            textAlignVertical: "top",
            marginVertical: 20,
            padding: 20,
        },
        checkListInput: {
            color: theme.text,
            marginLeft: 10,
            borderBottomWidth: 1,
            borderColor: theme.text,
            flex: 1,
            paddingVertical: 4,
        },
        deleteBtn: {
            marginLeft: 10,
            paddingHorizontal: 18,
            paddingVertical: 14,
            shadowColor: theme.shadow,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
            backgroundColor: theme.accent,
            borderRadius: 50,
        },
        overlay: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.5)", // dim background
        },
        modalContent: {
            width: "90%",
            borderRadius: 20,
            padding: 30,
        },
        resultItem: {
            paddingVertical: 12,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderColor: "#eee",
        },
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: "center",
            backgroundColor: theme.backgroundDark,
        },
        title: {
            fontSize: 28,
            fontWeight: '800',
            marginBottom: 5,
            color: theme.text,
        },
        logoutButton: {
            margin: 10,
            width: 150,
            backgroundColor: "#E53935",
            padding: 20,
            borderRadius: 50,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#E53935",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 5,
            elevation: 5,
        },
        profileLink: {
            width: '80%',
            padding: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomWidth: 1,
            borderColor: theme.text
        },
        grid: {
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
            padding: 30,
            gap: 12,
        },
        item: {
            width: 100,
            marginBottom: 12,
        },
        image: {
            width: 100,
            height: 100,
            borderRadius: 9999,
        },
        authLink: {
            color: theme.text,
            borderBottomWidth: 1,
            borderColor: theme.text,
            padding: 5
        },
    });

    return { styles, theme };
};
