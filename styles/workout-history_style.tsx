import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 10,
  },
  generalContainer: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
  generalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#e74c3c',
    fontSize: 14,
    marginRight: 5,
  },
  scrollContainer: {
    maxHeight: 400,
  },
  generalScrollContainer: {
    flex: 1,
  },
  dateGroup: {
    marginBottom: 15,
  },
  dateHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ccc',
  },
  logCard: {
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#222',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  logTime: {
    fontSize: 12,
    color: '#aaa',
  },
  exerciseTypeContainer: {
    marginBottom: 10,
  },
  exerciseType: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
  },
  logDetails: {
    marginVertical: 5,
  },
  setRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  setText: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 60,
    color: '#ccc',
  },
  setDetails: {
    fontSize: 14,
    color: '#ccc',
  },
  cardioRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  cardioLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    width: 80,
    color: '#ccc',
  },
  cardioValue: {
    fontSize: 14,
    color: '#ccc',
  },
  notesContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  notesLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#ccc',
  },
  notesText: {
    fontSize: 14,
    color: '#ccc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    padding: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
});