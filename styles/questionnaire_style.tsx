import { StyleSheet } from 'react-native';

const questionnaire_styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    // From first & fourth sheets:
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    // From second, third & fifth sheets:
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  content: {
    // From second, third, fourth & fifth sheets:
    flex: 1,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    paddingTop: 20,
    // From first sheet:
    alignItems: 'center',
  },
  title: {
    // From first sheet:
    color: 'white',
    marginBottom: 10,
    // From second, third, fourth & fifth sheets:
    textAlign: 'center',
  },
  subtitle: {
    color: '#e0e0e0',
    fontSize: 18,
    // First, second & third sheets defined marginBottom as 40,
    // but fourth & fifth override it to 20 – using the later value:
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    // Only defined in the first sheet:
    width: '100%',
    gap: 15,
  },
  input: {
    // From first sheet:
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    color: 'white',
    // From fourth & fifth sheets:
    marginBottom: 10,
  },
  equipmentContainer: {
    // Only defined in the second sheet:
    flex: 1,
    marginBottom: 20,
  },
  goalsContainer: {
    // Only defined in the third sheet:
    flex: 1,
    marginBottom: 20,
  },
  checkboxContainer: {
    // Defined identically in sheets two through five:
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    marginBottom: 10,
    padding: 15,
  },
  checkboxText: {
    color: 'white',
    fontSize: 16,
  },
  checkboxWrapper: {
    marginBottom: 5,
  },
  buttonContainer: {
    marginTop: 15,
    width: '100%',
  },
  button: {
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
  },
  sectionTitle: {
    // Only defined in sheets four & five:
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  formContainer: {
    // Only defined in sheets four & five:
    flex: 1,
    marginBottom: 20,
  },
});

export default questionnaire_styles;
