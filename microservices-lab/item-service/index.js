const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 8081;

let items = [
    { id: 0, name: "Book" },
    { id: 1, name: "Laptop" },
    { id: 2, name: "Phone" }
];

app.get('/items', (req, res) => {
    res.json(items);
});

app.post('/items', (req, res) => {
    const newItem = {
        id: items.length,
        name: req.body.name
    };
    items.push(newItem);
    res.status(201).json(newItem);
});

app.get('/items/:id', (req, res) => {
    const item = items.find(i => i.id == req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.json(item);
});

app.listen(PORT, () => {
    console.log(`Item Service running on port ${PORT}`);
});