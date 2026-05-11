// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();
// const app = express();
// app.use(cors());
// app.use(express.json());

// mongoose
//   .connect(process.env.MONGODB_URI)
//   .then(() => {
//     console.log("mongoDB connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const calcSchema = new mongoose.Schema({
//   expression: String,
//   Result: Number,
// });

// const calc = mongoose.model("Calc", calcSchema);

// app.post("/calculator", async (req, res) => {
//   const { expression } = req.body;
//   try {
//     const result = eval(expression);
//     const data = new Calc({ expression, result });
//     await data.save();
//     res.json({ result });
//   }
//    catch (err) {
//     res.json({ Error: "invalid expression" });
//   }
// });

// app.get("/history", async (req, res) => {
//   const data = await Calc.find();
//   res.json(data);
// });

// app.listen(5000, () => {
//   console.log("http://localhost:5000 ");
// });




const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("mongoDB connected"))
  .catch((err) => console.log(err));

const calcSchema = new mongoose.Schema({
  expression: String,
  result: Number, // Changed 'Result' to 'result' to match your data object
});

const Calc = mongoose.model("Calc", calcSchema);

// CHANGED: Route name is now /calculate to match your frontend fetch
app.post("/calculate", async (req, res) => {
  const { expression } = req.body;
  try {
    const result = eval(expression);
    // Use the Calc model correctly
    const data = new Calc({ expression, result });
    await data.save();
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: "invalid expression" });
  }
});

app.get("/history", async (req, res) => {
  try {
    const data = await Calc.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch history" });
  }
});

// Important for Vercel: export the app
module.exports = app;

// Only listen if running locally
if (process.env.NODE_ENV !== 'production') {
  app.listen(5000, () => console.log("Server running on port 5000"));
}
