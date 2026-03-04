const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8082;

let orders = [];
let idCounter = 1;

app.get('/orders', (req, res) => {
    res.json(orders);
});

app.post('/orders', (req, res) => {
    const order = {
        id: idCounter++,
        item: req.body.item,
        quantity: req.body.quantity,
        customerId: req.body.customerId,
        status: "PENDING"
    };
    orders.push(order);
    res.status(201).json(order);
});

app.get('/orders/:id', (req, res) => {
    const order = orders.find(o => o.id == req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
});

app.listen(PORT, () => {
    console.log(`Order Service running on port ${PORT}`);
});