const app = require("express")();
const port = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.send("Hello World!");
  res.end();
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
