const express = require('express');
const colors = require('colors');
const app = express();

app.listen(3500, () => {
    console.log(colors.green('Server running Succesful'));
})

app.get('/', (req, res) => {
    console.log(req.query)
    res.send('No che no sabes');
})