import AxiosInstance from "./AxiosInstance";

const HouseService = {
  loadHouses: async () => {
    try {
      const response = await AxiosInstance.get("/house/loadHouses");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeHouse: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/house/storeHouse", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getHouse: async (houseId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/house/getHouse/${houseId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateHouse: async (houseId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/house/updateHouse/${houseId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyHouse: async (houseId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/house/destroyHouse/${houseId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};



export default HouseService;
