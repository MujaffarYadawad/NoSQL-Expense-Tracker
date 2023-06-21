const User = require("../models/signup");
const bcrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

function generateAcceessToken(id, name, ispremiumuser) {
  return jwt.sign({ userId: id , name: name, ispremiumuser  }, "secretKey");
}

exports.postUser = async (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  try {
    bcrpt.hash(password, saltRounds, async (err, hash) => {
      const response = await User.find({ email: email });
      console.log(response);
      if (response.length === 0) {
        await User.create({
          name: name,
          email: email,
          password: hash,
          isPremiumUser: false
        });
        res.json({ alreadyexisting: false });
      } else {
        res.json({ alreadyexisting: true });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postLoginsUser = async (req, res, next) => {
  //console.log("e mai");
  
  const email = req.body.email;
  const password = req.body.password;

  try {
   
    const user = await User.find( { email: email } );

    console.log(user)
    if (user.length !== 0) {
   ///   const res2 = await User.find({ where: { password: password } });
     // console.log(res2)
      bcrpt.compare(password, user[0].password, async function (err, result) {
        if (err) {
          console.log(err);
        }

        //console.log(res2.length)
        if (result === true) {
          res.json({ success: true, token: generateAcceessToken(user[0].id, user[0].name, user[0].isPremiumUser) });
          //console.log('sss')
        } else {
          res.json({ password: "incorrect" });
        }
      });
    } else {
      res.json({ success: false });
    }
  } catch (error) {
    console.log(error);
  }
};
