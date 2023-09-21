const express = require('express')
const cors = require('cors')
const mysql = require('mysql');
const app = express()
const PORT = process.env.PORT || 3500

app.use(cors({
    origin: '*'
}));
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
app.get('/healthcheck', (req, res) => {
    res.status(200).send({
        value: 'Hello world'
    })
});
