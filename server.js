const express = require('express')
const cors = require('cors')
const app = express()
const PORT = process.env.PORT

app.use(cors({
    origin: '*'
}));
app.listen(PORT, () => console.log(`server running on port ${PORT}`))
app.get('/healthcheck', (req, res) => {
    res.status(200).send({
        value: 'Hello world'
    })
});