const axios = require('axios');
const res = require('express/lib/response');

const MT5_API_URL = 'https://mt5.mtapi.io';
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
const getOrderHistory = async (id) => {

    const endpoint = `${MT5_API_URL}/OrderHistory`;
    const currentDate = new Date();
    const params = {
        id,
        from:currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+currentDate.getDate(),
        to:currentDate.getFullYear()+"-"+(currentDate.getMonth()+1)+"-"+(currentDate.getDate()+1)
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
    
    const openOperdersendpoint = `${MT5_API_URL}/OpenOrders`;

    console.log(id,Symbol,operation,Volume);
    
    try {
        const orders = await axios.get(`https://mt5.mtapi.io/OpenedOrders?id=${id}&sort=OpenTime&ascending=true`);
        if (orders.data != null && orders.data.length > 0) {
            orders.data.forEach(async order => {
    //console.log(order,order.Symbol);
    if (order.symbol === Symbol && order.orderType != operation) {
                   await closeOrder(id, order.ticket);
                }
            });
        }
        
        let profit = await getProfit(id,Symbol);
        console.log(profit);
        if(profit < 15000){
            await openOrder(id, Symbol, operation, Volume);
        }
    } catch (error) {
        console.error('Error getting sendorder to MT5:', error.message);
        return error;
    }
}
const getProfit = async (id,Symbol)=>{
    const orderHistory = JSON.parse(await getOrderHistory(id));
    if (Array.isArray(orderHistory.orders)) {
        // Proceed with iteration
      } else {
        console.error('The orders property is not an array.');
      }
    let profit = 0;
        orderHistory.orders.forEach((x) => {
            if(x.symbol === Symbol){
                profit += x.profit;
            }
        });
        return profit;
}
const closeOrder = async (id, ticket) => {

    const endpoint = `${MT5_API_URL}/OrderClose`;
    console.log(id,ticket);
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

const openOrder = async (id, Symbol, operation, Volume) => {

    const endpoint = `${MT5_API_URL}/OrderSend`;

    const params = {
        id,
        Symbol,
        operation,
        Volume
    };
    try {
        const orders = await axios.get(`https://mt5.mtapi.io/OpenedOrders?id=${id}&sort=OpenTime&ascending=true`);
        console.log(orders);
        if (orders.data != null && orders.data.filter(x=>x.symbol === Symbol && x.orderType === operation).length == 0) {
            const response = axios.get(endpoint, {params});
            return response;
        }
    } catch (error) {
        console.error('Error getting close Order to MT5:', error.message);
        return error;
    }
}

module.exports = {
    getToken,sendOrder, closeOrder
};