//Seerver file
const express = require('express');
const app = express();
const cors = require('cors');//To control cors functionality

require('dotenv').config();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/routes', require('./routes'));
app.use('/',(req,res) => {
  res.send('Welcome to the API!');
});

//Server start
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});