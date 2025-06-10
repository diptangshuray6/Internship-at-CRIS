const express = require('express');
const router = express.Router();
const fs = require('fs');

//Fetch json data from json file
router.get('/getData', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) throw err;
        res.send(JSON.parse(data));
    });
});

//After editing the data save data to json file
router.post("/saveData", (req, res) => {
    const newData = req.body; // Extract the entire request body
    if (!newData || typeof newData !== "object") {
        return res.status(400).json({ error: "Invalid data format" });
    }

    fs.writeFile("data.json", JSON.stringify(newData, null, 2), (err) => {
        if (err) {
            console.error("Error saving data:", err);
            return res.status(500).json({ error: "Error saving data" });
        }
        res.json({ message: "Data saved successfully" });
    });
});



module.exports = router;

