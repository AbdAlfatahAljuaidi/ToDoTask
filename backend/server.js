const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const task = require("./routes/task");
const authRoutes = require('./routes/auth');

require('dotenv').config();

const app = express();

// مهم: مجرد استدعاء الملف بعمل initialize لـ Firestore
require('./config/firestore');

app.use(cookieParser());

app.use(cors({
 origin: process.env.ORIGIN,
 credentials:true
}));

app.use(express.json());

app.use('/', authRoutes);
app.use('/', task);

app.listen(process.env.PORT, ()=>{
 console.log(`Server is Ready ${process.env.PORT}`);
});