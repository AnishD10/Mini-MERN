const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoute = require('./Route/userRoute');
const employeeRoute = require('./Route/employRoute');  
const auth = require('./Middleware/auth')

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/user_api')
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/user'  ,  userRoute);
app.use('/api/employees', auth ,  employeeRoute);

app.listen(port, () => console.log(`server connected to ${port}`));