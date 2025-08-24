import AxiosInstance from "./AxiosInstance";

const BarangayService = {
  loadBarangays: async () => {
    try {
      const response = await AxiosInstance.get("/barangay/loadBarangays");
      return response;
    } catch (error) {
      throw error;
    }
  },
  storeBarangay: async (data: any) => {
    try {
      const response = await AxiosInstance.post("/barangay/storeBarangay", data);
      return response;
    } catch (error) {
      throw error;
    }
  },
  getBarangay: async (barangayId: string | number) => {
    try {
      const response = await AxiosInstance.get(`/barangay/getBarangay/${barangayId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },
  updateBarangay: async (barangayId: string | number, data: any) => {
    try {
      const response = await AxiosInstance.put(
        `/barangay/updateBarangay/${barangayId}`,
        data
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  destroyBarangay: async (barangayId: string | number) => {
    try {
      const response = await AxiosInstance.put(
        `/barangay/destroyBarangay/${barangayId}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
};



export default BarangayService;
