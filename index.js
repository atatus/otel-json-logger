const express = require('express');
const protobuf = require('protobufjs');
const app = express();
const PORT = 8072;

const root = new protobuf.Root();
root.resolvePath = (origin, target) => {
    // console.log(`origin: ${origin}, target: ${target}`);
    return 'opentelemetry-proto/' + target;
}

async function loadProtobufDefinitions() {
    try {
        const TracesData = root.loadSync('opentelemetry/proto/trace/v1/trace.proto').lookupType("TracesData");
        const MetricsData = root.loadSync('opentelemetry/proto/metrics/v1/metrics.proto').lookupType('MetricsData');
        const LogsData = root.loadSync('opentelemetry/proto/logs/v1/logs.proto').lookupType('LogsData');

        // Assuming you have message types named `TracesData`, `MetricsData`, and `LogsData` in your protobuf definitions
        global.protobufDefinitions = {
            TracesData: TracesData,
            MetricsData: MetricsData,
            LogsData: LogsData
        };

    } catch (err) {
         console.error('Error loading protobuf definitions:', err);
         throw err; // Rethrow the error to stop the server from starting
    }
}


app.use(express.raw({type: 'application/x-protobuf'}));

// Define the Express routes outside of the async function
function setupRoutes() {
    // Route for traces
    app.post('/v1/traces', (req, res) => {
        try {
            const message = global.protobufDefinitions.TracesData.decode(req.body);
            console.log('\nReceived trace message:', JSON.stringify(message));
            res.sendStatus(200);
        } catch (err) {
            console.error('Error decoding trace protobuf:', err);
            res.sendStatus(500);
        }
    });

    // Route for metrics
    app.post('/v1/metrics', (req, res) => {
        try {
            const message = global.protobufDefinitions.MetricsData.decode(req.body);
            console.log('\nReceived metrics message:', JSON.stringify(message));
            res.sendStatus(200);
        } catch (err) {
            console.error('Error decoding metrics protobuf:', err);
            res.sendStatus(500);
        }
    });

    // Route for logs
    app.post('/v1/logs', (req, res) => {
        try {
            const message = global.protobufDefinitions.LogsData.decode(req.body);
            console.log('\nReceived logs message:', JSON.stringify(message));
            res.sendStatus(200);
        } catch (err) {
            console.error('Error decoding logs protobuf:', err);
            res.sendStatus(500);
        }
    });
}

// Start the server after loading the protobuf definitions
(async () => {
 try {
        await loadProtobufDefinitions();
        setupRoutes();
        app.listen(PORT, () => {
             console.log(`Server listening on port ${PORT}`);
        });
 } catch (err) {
        console.error('Failed to start server:', err);
 }
})();
