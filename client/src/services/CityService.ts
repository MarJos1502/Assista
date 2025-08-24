import AxiosInstance from "./AxiosInstance";

const CityService = {
  loadCitys: async () => {
    try {
      const response = await AxiosInstance.get("/city/loadCitys");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeCity: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/city/storeCity", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getCity: async (cityId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/city/getCity/${cityId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateCity: async (cityId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/city/updateCity/${cityId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyCity: async (cityId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/city/destroyCity/${cityId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};



export default CityService;
