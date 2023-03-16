const app = require("express")();
const port = process.env.PORT || 8080;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname, "/index.html");
});

app.listen(port);
console.log("Server started at http://localhost:" + port);
