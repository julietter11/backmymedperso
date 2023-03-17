const mongoose = require('mongoose');

const connectionString = process.env.CONNECTION_STRING;

//const connectionString ='mongodb+srv://pommedepin:petitours122.@pommedapi.yct1yr1.mongodb.net/mymeds'

mongoose.connect(connectionString, { connectTimeoutMS: 2000 })
  .then(() => console.log('Database connected'))
  .catch(error => console.error(error));