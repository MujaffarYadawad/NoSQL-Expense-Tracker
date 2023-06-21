const uuid = require("uuid");
const sgMail = require("@sendgrid/mail");
const bcrypt = require("bcrypt");

const User = require("../models/signup");
const ForgotPassword = require("../models/forgotpassword")
const saltRounds = 10;


exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log("email->", email);
    const user = await User.findOne( { email: email } );
    console.log(user);
    if (user) {
      const id = uuid.v4();
     // console.log("id-->", id);
      const resetData = new ForgotPassword({
        uuid: id,
        active: true,
        userId: user.id,
      });
      resetData.save();
      console.log('reset data-->', resetData)
      if (resetData) {
        try {
          console.log("data entered in reset password table successfully");
        } catch (err) {
          console.log(err);
        }
      }

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email, // Change to your recipient
        from: "mujaffaryadawad587313@gmail.com", // Change to your verified sender
        subject: "Sending with SendGrid is Fun",
        text: "and easy to do anywhere, even with Node.js",
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset password</a>`,
      };
      console.log("msg-->", msg);

    await  sgMail
        .send(msg)
        .then((response) => {
          // console.log(response[0].statusCode)
          // console.log(response[0].headers)
          return res.status(response[0].statusCode).json({
            message: "Link to reset password sent to your mail ",
            sucess: true,
          });
        })
        .catch((error) => {
          throw new Error(error);
        });

      //send mail
    } else {
      throw new Error("User doesnt exist");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  const id = req.params.id;
  const request = await ForgotPassword.findOne({ uuid :id });
//console.log('request-->', request)
  if (request) {
   ForgotPassword.findOneAndUpdate({ uuid: id }, { active: false });
    res.send(`<html>
                        <form action="/password/updatepassword/${id}" method="get">
                            <label for="newpassword">Enter New password</label>
                            <input name="newpassword" type="password" required></input>
                            <button>reset password</button>
                        </form>
                    </html>`);
  }
};

exports.updatePassword = async (req, res, next) => {
  try {
    const newPassword = req.query.newpassword;
    const id = req.params.rid;
   // console.log('id--->>',id)
    const request = await ForgotPassword.findOne({uuid :  String(id)} );
//console.log('request--->', request)

   
      const user = await User.findOne({_id:request.userId});
      //console.log('uuuser-->', user)
      if (user) {
        bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
          await User.findByIdAndUpdate(request.userId, { password: hash });
          res.send(`
            <html>
              <h1> Success </h1> 
            </html>
          `);
        });
      } else {
        return res.status(404).json({ error: "No User Exist", success: false });
      }
    
  } catch (error) {
    console.log(error);
  }
};
