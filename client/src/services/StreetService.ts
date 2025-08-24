import AxiosInstance from "./AxiosInstance";

const StreetService = {
  loadStreets: async () => {
    try {
      const response = await AxiosInstance.get("/street/loadStreets");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeStreet: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/street/storeStreet", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getStreet: async (streetId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/street/getStreet/${streetId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateStreet: async (streetId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/street/updateStreet/${streetId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyStreet: async (streetId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/street/destroyStreet/${streetId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};



export default StreetService;
