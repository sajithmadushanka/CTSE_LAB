const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8083;

let payments = [];
let idCounter = 1;

app.get('/payments', (req, res) => {
    res.json(payments);
});

app.post('/payments/process', (req, res) => {
    const payment = {
        id: idCounter++,
        orderId: req.body.orderId,
        amount: req.body.amount,
        method: req.body.method,
        status: "SUCCESS"
    };
    payments.push(payment);
    res.status(201).json(payment);
});

app.get('/payments/:id', (req, res) => {
    const payment = payments.find(p => p.id == req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    res.json(payment);
});

app.listen(PORT, () => {
    console.log(`Payment Service running on port ${PORT}`);
});