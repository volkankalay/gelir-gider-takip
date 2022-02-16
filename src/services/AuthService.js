import axios from "axios";
import authHeader from "./AuthHeader";

const API_URL = "http://192.168.1.100/api/v1/";

export const register = async (email, password) => {
    return axios
        .post(API_URL + "register", {
            email: email,
            password: password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                sessionStorage.setItem("user", JSON.stringify(response.data));
                sessionStorage.setItem("userToken", JSON.stringify(response.data.token));
            }
            return response.data;
        });
};
export const login = async (email, password) => {
    return axios
        .post(API_URL + "register", {
            email: email,
            password: password,
        })
        .then((response) => {
            if (response.data.accessToken) {
                sessionStorage.setItem("user", JSON.stringify(response.data));
                sessionStorage.setItem("userToken", JSON.stringify(response.data.token));
            }
            return response.data;
        });
};
export const logout = async () => {

    return await axios.post(API_URL + "logout", {
        // data
    },
        {
            headers: {
                Authorization: `Bearer ` + JSON.parse(sessionStorage.getItem('userToken'))
            }
        })
        .then((res) => {
            sessionStorage.clear();
        })
        .catch((error) => {
            console.error(error)
        });
};
export const getCurrentUser = () => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
};
export const getCurrentToken = () => {
    const userToken = sessionStorage.getItem("userToken");
    if (userToken) return JSON.parse(userToken);
    return null;
};
