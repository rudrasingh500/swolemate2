/**
 * Exercise API client for fetching exercise data from ExerciseDB API
 */

interface ExerciseApiOptions {
  name?: string;
  offset?: number;
  limit?: number;
}

/**
 * Fetches exercise data from the ExerciseDB API
 * @param options - Configuration options for the API request
 * @param options.name - Exercise name to search for
 * @param options.offset - Number of results to skip (default: 0)
 * @param options.limit - Maximum number of results to return (default: 10)
 * @returns Promise containing the exercise data
 */
export async function fetchExercises(options: ExerciseApiOptions = {}) {
  const { name = '', offset = 0, limit = 10 } = options;
  
  // Determine which endpoint to use based on whether a name is provided
  let url;
  if (name && name.trim() !== '') {
    // Use the name search endpoint when a name is provided
    // Encode the name parameter to handle uppercase and special characters
    const encodedName = encodeURIComponent(name.trim().toLowerCase());
    url = `https://exercisedb.p.rapidapi.com/exercises/name/${encodedName}?offset=${offset}&limit=${limit}`;
  } else {
    // Use the list all exercises endpoint when no name is provided
    url = `https://exercisedb.p.rapidapi.com/exercises?offset=${offset}&limit=${limit}`;
  }
  
  const requestOptions = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'd2cb309ed3mshb11140497e8172ep126b01jsn9411b860eb85',
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}