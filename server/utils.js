const got = require('got');
const getIpFromReq = (req) => {
    const ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection.socket ? req.connection.socket.remoteAddress : null);
    return ip;
}

const checkValidUrl = async (url) => {
    const validImageTypes = [
        "image/gif",
        "image/jpeg",
        "image/png",
        "image/tiff",
        "image/vnd.microsoft.icon",
        "image/x-icon",
        "image/vnd.djvu",
        "image/svg+xml"
    ];
    try {
        const response = await got(url);
        console.log(response.statusCode, response.headers['content-type']);
        if (response.statusCode === 200 && validImageTypes.includes(response.headers['content-type'])) {
            return true;
        } 
        return false;
    } catch (err) {
        return false;
    }
}

module.exports = {
    getIpFromReq,
    checkValidUrl
}