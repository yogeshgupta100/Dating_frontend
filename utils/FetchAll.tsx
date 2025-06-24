import { getLocations } from "../src/services/Locations";
import { getModels } from "../src/services/models";

export const fetchLocations = async () => {
    try {
      const data = await getLocations();
      return data;
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  export const fetchModels = async (locationId = '') => {
    try {
      const data = await getModels(locationId);
      return data;
    } catch (error) {
      console.error('Error fetching models:', error);
    }
  };