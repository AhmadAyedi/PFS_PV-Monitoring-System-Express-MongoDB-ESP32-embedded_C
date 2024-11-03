/*const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 3008;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB (adjust the URI if necessary)
mongoose.connect('mongodb://127.0.0.1:27017/temperature_data', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Schema and model for temperature and humidity data
const dataSchema = new mongoose.Schema(
  {
    temperature: Number,
    humidity: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const Data = mongoose.model('Data', dataSchema);

// POST route to receive data from ESP32
app.post('/api/temperature', async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    const newData = new Data({ temperature, humidity });
    await newData.save();
    res.status(201).send('Data saved');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// GET route to retrieve the latest data for the frontend
app.get('/api/temperature/latest', async (req, res) => {
  try {
    const latestData = await Data.findOne().sort({ createdAt: -1 });
    res.json(latestData);
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).send('Error retrieving data');
  }
});

// Serve the frontend
app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path'); // Import path module

const app = express();
const port = 3008; // Changed to 3008

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/sensorData', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Could not connect to MongoDB:", err));

// Define Schema and Model
const dataSchema = new mongoose.Schema({
  temperature: Number,
  humidity: Number,
  createdAt: { type: Date, default: Date.now }
});

const Data = mongoose.model('Data', dataSchema);

// Route to receive data from ESP32
app.post('/api/temperature', async (req, res) => {
  try {
    const { temperature, humidity } = req.body;
    const data = new Data({ temperature, humidity });
    await data.save();
    res.status(201).send('Data saved');
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).send('Error saving data');
  }
});

// Route to retrieve the latest data entry
app.get('/api/temperature/latest', async (req, res) => {
  try {
    const latestData = await Data.findOne().sort({ createdAt: -1 });
    res.json(latestData);
  } catch (error) {
    console.error('Error retrieving latest data:', error);
    res.status(500).send('Error retrieving latest data');
  }
});

// Route to retrieve the last 20 data entries for chart display
app.get('/api/temperature/history', async (req, res) => {
  try {
    const history = await Data.find().sort({ createdAt: -1 }).limit(20);
    res.json(history.reverse()); // Reverse to show oldest first
  } catch (error) {
    console.error('Error retrieving data history:', error);
    res.status(500).send('Error retrieving data history');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
