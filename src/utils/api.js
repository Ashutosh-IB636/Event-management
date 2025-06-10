

const API_KEY = "";

export const fetchLocation = async (latitude, longitude) => {
  try {
    console.log(API_KEY);
    const response = await fetch(
      `https://us1.locationiq.com/v1/reverse.php?key=${API_KEY}&lat=${latitude}&lon=${longitude}&format=json`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

export const fetchSuggestions = async (input) => {
  try {
    const response = await fetch(
      `https://us1.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${input}&limit=5&format=json`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};