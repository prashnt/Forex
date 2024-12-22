const { getToken, getAccount } = require('../services/mt5Service');

exports.sendSignal = async(req,res)=>{
    const { name, email } = req.body;
    
    res.status(200).json({msg:`Account detials ${await getAccount(await getToken(185920045,'Durva@2281','Exness-MT5Real26'))}`});
};
