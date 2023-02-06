
const axios = require('axios');

const GET_DATA_1NCH = {
    url: 'https://api.1inch.exchange/v4.0/',
    urldecode: 'https://tokens.1inch.exchange/v1.0/',
    approve: '/approve/spender',
    healthcheck: '/healthcheck',
    protocols: '/protocols',
    protocolsImages: '/protocols/images',
    tokens: '/tokens',
    presets: '/presets',
};

 async function getDataFrom1nch(getData, chainID) {
    try {
        const response = await axios.get(GET_DATA_1NCH.url + chainID + getData);
       // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

 async function quoteFrom1nch(fromTokenAddress, toTokenAddress, amount, chainID) {
    try {
        const requestUrl = GET_DATA_1NCH.url + chainID + '/quote?fromTokenAddress=' +
            fromTokenAddress + '&toTokenAddress=' + toTokenAddress + '&amount=' + amount;
        const response = await axios.get(requestUrl);
       // console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

 async function swapFrom1nch(fromTokenAddress, toTokenAddress, amount, fromAddress, slippage, chainID) {
    try {
        const requestUrl = GET_DATA_1NCH.url + chainID + '/swap?fromTokenAddress=' +
            fromTokenAddress + '&toTokenAddress=' + toTokenAddress + '&amount=' + amount +
            '&fromAddress=' + fromAddress + '&slippage=' + slippage + '&disableEstimate=true';
        const response = await axios.get(requestUrl);
      //  console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

 async function decodeswapFrom1nch(data) {

    try {

        const requestUrl = GET_DATA_1NCH.urldecode + 'decode/0x11111112542d85b3ef69ae05771c2dccff4faa26';

        const response = await axios.post(requestUrl, {
            headers: {
             'content-type': ' application/json',
            },
            data,
         });

      //  console.log(response.data);
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    decodeswapFrom1nch,
    swapFrom1nch,
    quoteFrom1nch,
    getDataFrom1nch
};