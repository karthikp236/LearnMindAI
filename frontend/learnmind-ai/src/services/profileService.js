import axiosInstance from "../utils/axiosinstance";
import { API_PATHS } from "../utils/apiPaths";

const getProfile = async () => {
  const response = await axiosInstance.get(
    API_PATHS.AUTH.GET_PROFILE
  );

  return response.data;
};

const updateProfile = async (data) => {
  const response = await axiosInstance.put(
    API_PATHS.AUTH.UPDATE_PROFILE,
    data
  );

  return response.data;
};

const changePassword = async (data) => {
  const response = await axiosInstance.post(
    API_PATHS.AUTH.CHANGE_PASSWORD,
    data
  );

  return response.data;
};

export default {
  getProfile,
  updateProfile,
  changePassword,
};