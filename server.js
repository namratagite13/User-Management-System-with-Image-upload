require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const connectedToDB = require('./database/db');
const authRoutes = require('./routes/auth-routes');
const homeRoutes = require('./routes/home-routes')
const adminRoutes = require('./routes/admin-routes');
const imageRoutes = require('./routes/image-routes')
//middleware
app.use(express.json());

//database
connectedToDB()

//routes
app.use('/api/auth', authRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/image', imageRoutes)

//listening to the port

app.listen(PORT, (req, res) =>{
    console.log(`App is listening on the PORT: ${PORT}`)
});