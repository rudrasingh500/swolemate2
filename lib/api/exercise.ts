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
  // When searching by name, use a higher default limit to ensure we get enough results for filtering
  const { name = '', offset = 0 } = options;
  // If searching by name and limit is 1, use 10 as the minimum limit to ensure we get enough results for filtering
  const limit = name && options.limit === 1 ? 10 : (options.limit || 10);
  
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
    
    const data = await response.json();
    
    // If searching by name, prioritize matches by relevance
    if (name && name.trim() !== '' && Array.isArray(data) && data.length > 0) {
      const searchTerm = name.trim().toLowerCase();
      
      // 1. Look for exact match (case insensitive)
      // This includes handling singular/plural variations
      const exactMatches = data.filter(exercise => {
        const exerciseName = exercise.name.toLowerCase();
        return (
          exerciseName === searchTerm ||
          exerciseName === searchTerm + 's' ||
          exerciseName + 's' === searchTerm
        );
      });
      
      // If exact matches found, return them as the only results
      if (exactMatches.length > 0) {
        return exactMatches;
      }
      
      // 2. Look for exact word count matches
      // This handles cases where we want "russian twist" but not "assisted motion russian twist"
      const exactWordCountMatches = data.filter(exercise => {
        const exerciseName = exercise.name.toLowerCase();
        const exerciseNameWords = exerciseName.split(' ');
        const searchTermWords = searchTerm.split(' ');
        
        // Check if the exercise name has the same number of words as the search term
        // AND the exercise name is exactly the search term
        return exerciseNameWords.length === searchTermWords.length && 
               exerciseName === searchTerm;
      });
      
      if (exactWordCountMatches.length > 0) {
        return exactWordCountMatches;
      }
      
      // 3. Look for exercises where the name is exactly the search term
      // This is a stricter version of the previous check that ensures exact name matching
      const strictNameMatches = data.filter(exercise => {
        return exercise.name.toLowerCase() === searchTerm;
      });
      
      if (strictNameMatches.length > 0) {
        return strictNameMatches;
      }
      
      // 4. Look for basic exercise name that matches the search term exactly as a whole phrase
      // This handles cases where the search is for a basic exercise (e.g., "russian twist")
      // but the API returns variations (e.g., "assisted motion russian twist")
      const basicNameMatches = data.filter(exercise => {
        const exerciseName = exercise.name.toLowerCase();
        const searchTermWords = searchTerm.split(' ');
        
        // Only consider matches where all words from the search term appear together in sequence
        if (searchTermWords.length > 1) {
          return (
            // Exact match at the beginning of the name
            exerciseName.startsWith(searchTerm + ' ') ||
            // Exact match at the end of the name
            exerciseName.endsWith(' ' + searchTerm) ||
            // Exact match as a whole phrase in the middle
            exerciseName.includes(' ' + searchTerm + ' ')
          );
        } else {
          // For single-word searches, ensure it's a whole word match
          const exerciseNameWords = exerciseName.split(' ');
          return exerciseNameWords.includes(searchTerm);
        }
      });
      
      if (basicNameMatches.length > 0) {
        // Sort matches by length (shorter names first) to prioritize simpler variations
        return basicNameMatches.sort((a, b) => a.name.length - b.name.length);
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}