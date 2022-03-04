var whitelist = [
    'https://cavalliniimoveis.com.br',
    'http://cavalliniimoveis.com.br',
    'http://localhost:4200',
    'http://localhost:3000'
];
var allowedHeaders = [
    'Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'
]
var methods = [
    'GET, POST, OPTIONS'
]

var corsOptionsDelegate = function (req, callback) {
    var origin = req.header('Origin');
    var corsOptions = {
        origin: true,
        allowedHeaders: allowedHeaders,
        methods: methods,
        preflightContinue: true,
        optionsSuccessStatus: 204,
        credentials: true
    }
    
    console.log('Origin:', origin);

    // allow requests with no origin 
    // (like mobile apps or curl requests)
    if (!origin) return callback(null, corsOptions);
    if (whitelist.indexOf(origin) === -1) {
        var msg = 'The CORS policy for this site does not allow access from the specified Origin.';
        return callback(new Error(msg), false);
    }
    return callback(null, corsOptions);

}

module.exports = corsOptionsDelegate;