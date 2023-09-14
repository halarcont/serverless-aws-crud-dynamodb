const https = require('https');
const getStatus = (defaultOptions, path, payload) => new Promise((resolve, reject) => {
    const options = { ...defaultOptions, path, method: 'GET' };
    const req = https.request(options, res => {
        let buffer = "";
        res.on('data', chunk => buffer += chunk)
        res.on('end', () => resolve(JSON.parse(buffer)))
    });
    req.on('error', e => reject(e.message));
    req.write(JSON.stringify(payload));
    req.end();
})

exports.joke = async (event) => {
    // TODO
    const defaultOptions = {
        host: 'official-joke-api.appspot.com', //_hostname : example.com, passed from event as a parameter
        port: 443, // or 80 for http
        headers: {
         'Content-Type': 'application/json',
        }
    }
    var respuesta = await getStatus(defaultOptions, '/random_joke', ''); //_pathname : /user/add, passed from event as a parameter
    // TODO implement
    const response = {
        statusCode: 200,
        body: JSON.stringify(respuesta),
    };
    return response;
};