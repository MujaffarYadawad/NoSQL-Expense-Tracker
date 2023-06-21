const path = require("path");
const fs = require("fs");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const mongoose = require('mongoose')
// const mongoConnect = require('./util/database')

dotenv.config();
const app = express();

 const userRoutes = require("./routes/user");
 const expenseRoutes = require("./routes/expense");
 const buyPremium = require("./routes/purchase");
 const premiumRoutes = require("./routes/premiumFeature");
 const resetPasswordRoutes = require("./routes/resetpassword");

// const accessLogStream = fs.createWriteStream(
//   path.join(__dirname, "access.log"),
//   { flags: "a" }
// );

 

app.use(bodyParser.json({ extended: false }));
app.use(cors());

// const sequelize = require("./util/database");

 const Expense = require("./models/expense");
 const User = require("./models/signup");
 //const Order = require("./models/orders");
 const Forgotpassword = require("./models/forgotpassword");
// const Downloadfiles = require("./models/downloadFiles");

 app.use("/user", userRoutes);
 app.use("/expense", expenseRoutes);
 app.use("/purchase", buyPremium);
 app.use("/premium", premiumRoutes);
 app.use("/password", resetPasswordRoutes);

// app.use((req, res) => {
//   console.log("url-->", req.originalUrl);
//   res.sendFile(path.join(__dirname, `public/${req.originalUrl}`));
// });


// User.hasMany(Expense);
// Expense.belongsTo(User);

// User.hasMany(Order);
// Order.belongsTo(User);

// User.hasMany(Forgotpassword);
// Forgotpassword.belongsTo(User);

// User.hasMany(Downloadfiles);
// Downloadfiles.belongsTo(User);

// sequelize
//   .sync()
//   .then((result) => {
//     app.listen(3000);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// app.use((req, res, next) => {
//   res.status(404).send("<h1>Page Not Found</h1>");
// });

mongoose.connect(
  'mongodb+srv://Mujaffar:PLFfqARbtgZa4YNG@cluster0.mocnynh.mongodb.net/?retryWrites=true&w=majority')
  .then(() => {
    app.listen(3000)
    console.log('Connected!')
  }).catch(err => {
    console.log(err)
  })
 





