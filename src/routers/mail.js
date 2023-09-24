const express = require("express");
const { sendDetails } = require("../services/emailService");
const router = new express.Router();

router.get("/checkout/:hash", async (req, res) => {
  const details = req?.params?.hash;
  //   console.log("req", req);
  if (details) {
    // console.log("details", details);
    const parsedDetails = JSON.parse(Buffer.from(details, "base64").toString());
    sendDetails(parsedDetails, (error, info) => {
      if (error) {
        console.log("error", error);
      } else {
        console.log("info: >>", "Email Sent");
      }
    });
  }
  res.send();
});
module.exports = router;
