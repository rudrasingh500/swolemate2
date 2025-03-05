import { StyleSheet } from "react-native";
import common_styles from "./common_style";

const auth_styles = StyleSheet.create({
    ...common_styles,
    overlay: {
      ...common_styles.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      paddingTop: undefined,
      paddingHorizontal: undefined,
      paddingBottom: undefined,
    },
    content: {
      ...common_styles.content,
      alignItems: 'center',
      flex: undefined,
    },
    title: {
      ...common_styles.title,
      fontSize: 48,
      fontWeight: 'bold',
    },
    subtitle: {
      ...common_styles.subtitle,
      marginBottom: 40,
    },
    inputContainer: {
      width: '100%',
      gap: 15,
    },
    input: {
      ...common_styles.input,
      marginBottom: undefined,
    },
    link: {
      marginTop: 20,
      alignSelf: 'center',
    },
    linkText: {
      color: '#e0e0e0',
    },
  });

export default auth_styles;