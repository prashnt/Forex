const axios = require('axios');
const axiosRetry = require('axios-retry').default;
const res = require('express/lib/response');

axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount) => {
        console.log(`⏳ Retry attempt ${retryCount}`);
        return retryCount * 1000; // delay in ms
    },
    retryCondition: (error) => {
        // Retry on 503 or network error
        return (
            axiosRetry.isNetworkOrIdempotentRequestError(error) ||
            error?.response?.status === 503
        );
    },
});

const {
    zonedTimeToUtc,
    utcToZonedTime,
    // format,
    formatInTimeZone,
    getTimezoneOffset,
} = require('date-fns-tz');
const { addDays } = require('date-fns');
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


    const openOperdersendpoint = `${MT5_API_URL}/OpenOrders`;

    try {
        const orders = await axios.get(`https://mt5.mtapi.io/OpenedOrders?id=${id}&sort=OpenTime&ascending=true`);
        if (orders.data != null && orders.data.length > 0) {
            orders.data.forEach(async order => {
                console.log(order,order.Symbol);
                if (order.symbol === Symbol && order.orderType != operation) {
                    await closeOrder(id, order.ticket);
                }
            });
        }
        //let profit = await getProfit(id,Symbol);
        //if(profit < 30000){
        await openOrder(id, Symbol, operation, Volume);
        //}
        // else {
        //     console.log("You Reached Your Goal for "+Symbol+"==>"+profit);
        // }
    } catch (error) {
        console.error('Error getting sendorder to MT5:', error.message);
        return error;
    }
}

const getOrderHistory = async (id) => {

    const endpoint = `${MT5_API_URL}/OrderHistory`;
    const currentDate = new Date();
    const startOfDayUTC = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        0, 0, 0
    ));

    const endOfDayUTC = new Date(Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate(),
        23, 59, 59, 999
    ));

    console.log('Start of the day (UTC):', startOfDayUTC.toISOString());
    console.log('End of the day (UTC):', endOfDayUTC.toISOString());
    const params = {
        id,
        from: startOfDayUTC.toISOString(),
        to: endOfDayUTC.toISOString()
    };
    try {
        const response = await axios.get(endpoint, { params });
        return JSON.stringify(response.data);
    } catch (error) {
        console.error('Error getting Account to MT5:', error.message);
        throw error.response ? error.response.data : error;
    }
}
const getProfit = async (id, Symbol) => {
    const orderHistory = JSON.parse(await getOrderHistory(id));
    if (Array.isArray(orderHistory.orders)) {
        // Proceed with iteration
    } else {
        console.error('The orders property is not an array.');
    }
    //console.log(JSON.stringify(orderHistory));
    let profit = 0;
    if (orderHistory.orders != undefined || orderHistory.orders.length > 0) {
        orderHistory.orders.forEach((x) => {
            if (x.symbol === Symbol) {
                profit += x.profit;
            }
        });
    }
    else {
        profit = 0;
    }
    return profit;
}
const closeOrder = async (id, ticket) => {

    const endpoint = `${MT5_API_URL}/OrderClose`;
    console.log(id, ticket);
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
    const quote = await GetQuote(id, Symbol);
    //console.log(quote.data);
    if (quote.data != undefined || quote.data != null) {
        const endpoint = `${MT5_API_URL}/OrderSend`;
        let stoploss = 0.0;
            let placedType="Manually";
            let expirationType="Specified";
        let takeprofit = 0.0;
        if (operation === 'Buy') {
            stoploss = Symbol === 'XAUUSDm' ? quote.data.ask - 6 : quote.data.ask - 1000;
            takeprofit = quote.data.ask + 6;
        }
        if (operation === 'Sell') {
            stoploss = Symbol === 'XAUUSDm' ? quote.data.ask + 6 : quote.data.bid + 1000;
            takeprofit = quote.data.bid - 6;
        }
        const params = {
            id,
            Symbol,
            operation,
            Volume,
            placedType,
            stoploss,
            expirationType
        };
        try {
            const orders = await axios.get(`https://mt5.mtapi.io/OpenedOrders?id=${id}&sort=OpenTime&ascending=true`);
            if (orders.data != null && orders.data.filter(x => x.symbol === Symbol && x.orderType === operation && x.closeLots==0).length == 0) {
                const response = axios.get(endpoint, { params });
                 //console.log((await response).data);
                return response;
            }
        } catch (error) {
            console.error('Error getting close Order to MT5:', error.message);
            return error;
        }
    }
}
const GetQuote = async (id, Symbol) => {
    const endpoint = `${MT5_API_URL}/GetQuote`;
    const params = {
        id,
        Symbol
    };
    try {
        const data = await axios.get(`https://mt5.mtapi.io/GetQuote?id=${id}&symbol=${Symbol}`);
        return data;
    } catch (error) {
        console.error('Error getting for symbol information to MT5:', error.message);
        return null;
    }
}
module.exports = {
    getToken, getAccount, sendOrder, closeOrder
};