const express = require("express");
require("./db/mongoose");
const path = require("path");
// const cookie = require('cookie-parser')
const hbs = require("hbs");
const cors = require("cors");
const metadataRouter = require("./routers/metadata");
const pageRouter = require("./routers/pages");
const leagueRouter = require("./routers/league");
const leagueResultRouter = require("./routers/leagueResults");
const gsRouter = require("./routers/sclGS");
const qfRouter = require("./routers/sclQF");
const sfRouter = require("./routers/sclSF");
const finRouter = require("./routers/sclFIN");
const authRouter = require("./routers/admin");
const teamRouter = require("./routers/team");

const app = express();
const port = process.env.PORT;
app.use(cors());
app.use(metadataRouter);
app.use(pageRouter);
app.use(leagueRouter);
app.use(leagueResultRouter);
app.use(gsRouter);
app.use(qfRouter);
app.use(sfRouter);
app.use(finRouter);
app.use(authRouter);
app.use(teamRouter);

const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicPath));
app.get("/*", (req, res) => {
  res.render("404", {
    title: "Page Not Found!",
    name: "Benjamin Possible",
  });
});
app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
