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
      'x-rapidapi-key': process.env.EXPO_PUBLIC_EXERCISEDB_API_KEY!,
      'x-rapidapi-host': process.env.EXPO_PUBLIC_EXERCISEDB_URL!,
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

      const potentialMatches = data.filter(exercise => {
        const exerciseNameLower = exercise.name.toLowerCase();
        const searchTermWords = searchTerm.split(' ').filter(w => w.length > 0);
        const exerciseNameWords = exerciseNameLower.split(' ').filter((w: string) => w.length > 0);

        // Check 1: Exact match (including common singular/plural variations)
        if (exerciseNameLower === searchTerm || 
            exerciseNameLower === searchTerm + 's' || 
            (searchTerm.endsWith('s') && exerciseNameLower + 's' === searchTerm)) { // check if searchTerm is plural and exerciseName is singular
          return true;
        }

        // Check 2: Search term is a substring (whole phrase or significant part)
        if (exerciseNameLower.includes(searchTerm)) {
            if (searchTermWords.length > 1) {
                // For multi-word search terms, check for more precise phrase matching
                if (exerciseNameLower.startsWith(searchTerm + ' ') ||
                    exerciseNameLower.endsWith(' ' + searchTerm) ||
                    exerciseNameLower.includes(' ' + searchTerm + ' ') ||
                    exerciseNameLower === searchTerm) { // handles exact phrase match without spaces
                    return true;
                }
            } else { // Single word search term
                // Ensure it's a whole word match for single search terms
                if (exerciseNameWords.includes(searchTerm)) {
                    return true;
                }
            }
        }
        // Check 3: All search term words are present in the exercise name (more flexible)
        if (searchTermWords.every(word => exerciseNameLower.includes(word))) {
          return true;
        }

        return false;
      });

      if (potentialMatches.length > 0) {
        potentialMatches.sort((a, b) => {
          const aNameLower = a.name.toLowerCase();
          const bNameLower = b.name.toLowerCase();
          const searchTermWordsCount = searchTerm.split(' ').filter(w => w.length > 0).length;

          // Priority 1: Exact matches (including singular/plural)
          const aIsExact = (aNameLower === searchTerm || aNameLower === searchTerm + 's' || (searchTerm.endsWith('s') && aNameLower + 's' === searchTerm));
          const bIsExact = (bNameLower === searchTerm || bNameLower === searchTerm + 's' || (searchTerm.endsWith('s') && bNameLower + 's' === searchTerm));
          if (aIsExact && !bIsExact) return -1;
          if (!aIsExact && bIsExact) return 1;
          if (aIsExact && bIsExact) {
            // If both are exact, prefer shorter name (though they should be same length if truly exact)
            return a.name.length - b.name.length; 
          }

          // Priority 2: Search term is a complete phrase within the name
          const aContainsPhrase = (
            aNameLower.startsWith(searchTerm + ' ') || 
            aNameLower.endsWith(' ' + searchTerm) || 
            aNameLower.includes(' ' + searchTerm + ' ') || 
            aNameLower === searchTerm
          );
          const bContainsPhrase = (
            bNameLower.startsWith(searchTerm + ' ') || 
            bNameLower.endsWith(' ' + searchTerm) || 
            bNameLower.includes(' ' + searchTerm + ' ') || 
            bNameLower === searchTerm
          );
          if (aContainsPhrase && !bContainsPhrase) return -1;
          if (!aContainsPhrase && bContainsPhrase) return 1;

          // Priority 3: Shorter names are generally preferred for base exercises
          if (a.name.length !== b.name.length) {
            return a.name.length - b.name.length;
          }
          
          // Priority 4: Closer word count to search term
          const aWordDiff = Math.abs(aNameLower.split(' ').length - searchTermWordsCount);
          const bWordDiff = Math.abs(bNameLower.split(' ').length - searchTermWordsCount);
          if (aWordDiff !== bWordDiff) {
            return aWordDiff - bWordDiff;
          }

          // Priority 5: Fewer extra words compared to search term
          const aExtraWords = aNameLower.split(' ').length - searchTermWordsCount;
          const bExtraWords = bNameLower.split(' ').length - searchTermWordsCount;
          if (aExtraWords >= 0 && bExtraWords >= 0) { // only compare if both have at least as many words
            if (aExtraWords !== bExtraWords) return aExtraWords - bExtraWords;
          }

          return 0; 
        });
        return [potentialMatches[0]]; // Return only the top sorted match
      }
      
      return []; // If no relevant matches found after filtering and sorting
    }
    
    return data; // If not searching by name, or data is empty, or no name provided
  } catch (error) {
    console.error('Error fetching exercises:', error);
    throw error;
  }
}