const { getToken, getAccount, sendOrder } = require('../services/mt5Service');

exports.sendSignal = async(req,res)=>{
    const { Symbol, Signal, Volume, user, password, server } = req.body;
    const id = await getToken(user, password, server);
    console.log(id);
    try{
        res.status(200).json({msg:`Account detials ${
            await sendOrder(id, Symbol, Signal, Volume)}`});
    }
    catch(error){
        throw error.response ? error.response.data : error;
    }
};
