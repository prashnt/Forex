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

const getAccount = async (id) => {

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

const sendOrder = async (id, Symbol, operation, Volume) => {

    const endpoint = `${MT5_API_URL}/OrderSend`;
    const openOperdersendpoint = `${MT5_API_URL}/OpenOrders`;

    const params = {
        id,
        Symbol,
        operation,
        Volume
    };
    try {
        const orders = await axios.get(`https://mt5.mtapi.io/OpenedOrders?id=${id}&sort=OpenTime&ascending=true`);
        if (orders.data != null && orders.data.length) {
            orders.data.forEach(async order => {
                if (order.symbol === params.Symbol && order.orderType != params.operation) {
                    await axios.get(`https://mt5.mtapi.io/OrderClose?id=${id}&ticket=${order.ticket}`);
                }
            });
        }
        const response = await axios.get(endpoint, { params });
        return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error getting sendorder to MT5:', error.message);
        return error;
    }
}

const closeOrder = async (id, ticket) => {

    const endpoint = `${MT5_API_URL}/OrderClose`;

    const params = {
        id,
        ticket
    };
    try {
        const response = await axios.get(endpoint, { params });
        return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error getting close Order to MT5:', error.message);
        return error;
    }
}

module.exports = {
    getToken, getAccount, sendOrder, closeOrder
};