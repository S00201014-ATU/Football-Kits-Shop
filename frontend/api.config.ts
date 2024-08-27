export const API_BASE_URL = "https://football-kits-shop-kveq.onrender.com";

export const apiRequest = async (endpoint: string, options: RequestInit = {}): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    const errorMessage = `An error has occurred: ${response.status}`;
    throw new Error(errorMessage);
  }

  return response.json();
};
