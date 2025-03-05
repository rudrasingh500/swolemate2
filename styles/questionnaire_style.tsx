import { StyleSheet } from 'react-native';
import common_styles from './common_style';

const questionnaire_styles = StyleSheet.create({
  ...common_styles,
  overlay: {
    ...common_styles.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  content: {
    ...common_styles.content,
    paddingTop: 20,
    alignItems: 'center',
    width: '100%',
    maxWidth: '100%',
  },
  subtitle: {
    ...common_styles.subtitle,
    fontSize: 18,
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    gap: 15,
    paddingHorizontal: 20,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    marginBottom: 10,
    width: '100%',
  },
  equipmentContainer: {
    flex: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  goalsContainer: {
    flex: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  checkboxContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
    width: '100%',
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
  },
  checkboxWrapper: {
    marginBottom: 5,
    width: '100%',
  },
  buttonContainer: {
    marginTop: 15,
    width: '100%',
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    width: '100%',
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    width: '100%',
    paddingHorizontal: 20,
  },
  formContainer: {
    flex: 1,
    marginBottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default questionnaire_styles;
