import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getSettings = async () => {
    try {
        let res = await axios.get(`${apiURL}/api/settings/get-settings`);
        return res.data;
    } catch (error) {
        console.log(error);
    }
};

export const updateSettings = async (settings) => {
    let bearerToken = localStorage.getItem("jwt") ? JSON.parse(localStorage.getItem("jwt")).token : "";
    try {
        let res = await axios.post(`${apiURL}/api/settings/update-settings`, settings, {
            headers: {
                token: `Bearer ${bearerToken}`,
            },
        });
        return res.data;
    } catch (error) {
        console.log(error);
    }
};
