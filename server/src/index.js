const express = require("express");
const cors = require("cors");
const app = express();
const port = 3080;
const db = require("./querries/querries2");

app.use(express.json());
app.use(cors());

app.get("/api/outEcp", db.outEcp);
app.get("/api/orgTypeNumber", db.orgTypeNumber);
app.get("/api/orgTypes", db.orgTypes);
app.get("/api/solutionsCoef", db.solutionsCoef);
app.get("/api/solutionsFinalCoef", db.solutionsFinalCoef);
app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
