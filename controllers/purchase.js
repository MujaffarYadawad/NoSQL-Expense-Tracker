  
const Razorpay = require("razorpay");
const Order = require("../models/orders");
const User = require("../models/signup")
 
 
exports.postPurchase = async (req, res) => {
  try {
    var rzp = new Razorpay({
      key_id: process.env.RAZORPAP_KEY_ID,
      key_secret: process.env.RAZORPAP_KEY_SECRET
    })
    console.log("rzp object->>",rzp)
    const amount = 3000;
    rzp.orders.create({ amount, currency: "INR" }, (err, order) => {
      console.log('err ->> ',err)
      if (err) {
        throw new Error(JSON.stringify(err));
      }
      console.log('order--:',order)
      console.log(order.id, 'order id')
      console.log('userid -->',req.user[0]._id)
     // req.user.createOrder({ orderid: order.id, status: "PENDING" })
        const ORDER=new Order({orderid:order.id, status:'PENDING', userId:req.user[0]._id})
        console.log('orders obj --', ORDER)
            ORDER.save()
      .then(() => {
          return res.status(201).json({ order, key_id: rzp.key_id });
        })
        .catch(err => {
          throw new Error(err);
        });
    });
  } catch (err) {
    console.log(err);
     res.status(403).json({ message: "Sometghing went wrong", error: err });
  }
};

exports.updateTransactonStatus = async (req, res) => {
 try {
    const { payment_id, order_id } = req.body;

    const order = await Order.findOne({ orderid: order_id });
    order.paymentid = payment_id;
    order.status = "Successful";
    await order.save();

    const userId = req.user[0]._id;
   // console.log('userid-->', userId)
    await User.findByIdAndUpdate(userId, { isPremiumUser: true });

   // console.log("done");
    return res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    console.error(err);
    // Handle the error appropriately
    return res.status(500).json({ success: false, message: "An error occurred during transaction processing" });
  }
}
 
 

 
 
