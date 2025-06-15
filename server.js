const express = require('express')
// require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const doctorRoute = require('./routes/doctorRoute');
const path = require('path');
app.use(express.json());
const cors = require('cors');
app.use(cors());
require('./config/dbConfig');

app.use('/api/user', userRoute)
app.use('/api/admin', adminRoute)
app.use('/api/doctor', doctorRoute)


if (process.env.NODE_ENV === 'production') {
    app.use("/". express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client/build/index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server listening port http://localhost:${port}`)
})