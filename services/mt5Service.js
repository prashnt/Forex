const axios = require('axios');

const MT5_API_URL = 'https://mt5.mtapi.io';


// Function to connect to MT5
const getToken = async (user, password, server) => {
    const endpoint = `${MT5_API_URL}/ConnectEx`;
    const params = {
        user,
        password,
        server
    };

    try {
        const response = await axios.get(endpoint, { params });
        return response.data;
    } catch (error) {
        console.error('Error connecting to MT5:', error.message);
        throw error.response ? error.response.data : error;
    }
};

const getAccount = async (id) =>{

    const endpoint = `${MT5_API_URL}/Account`;
    const params = {
        id
    };
    try {
        const response = await axios.get(endpoint, { params });
        return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error getting Account to MT5:', error.message);
        throw error.response ? error.response.data : error;
    }
}

module.exports = {
    getToken,getAccount
};