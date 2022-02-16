import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://192.168.1.100/api/v1/";


export const getUserDetails = () => {
    return axios.get(API_URL + "user", { headers: authHeader() });
  };