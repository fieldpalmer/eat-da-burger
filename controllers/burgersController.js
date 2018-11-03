const express = require("express");

const router = express.Router();

// Import the model (cat.js) to use its database functions.
const burger = require("../models/burger.js");

// Create all our routes and set up logic within those routes where required.
router.get("/api/burgers", (req, res) => {
  burger.selectAll( (data) => {
    res.json(data);
  });
});

router.post("/api/burgers", (req, res) => {
  burger.insertOne(["name", "description", "devoured"], [req.body.name, req.body.description, req.body.devoured], (result) => {
    // Send back the ID of the new burger
    res.json({ id: result.insertId });
  });
});

router.put("/api/burgers/:id", (req, res) => {
  let condition = "id = " + req.params.id;
  burger.updateOne({ devoured: req.body.devoured }, condition, (result) => {
    if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});

// Export routes for server.js to use.
module.exports = router;
