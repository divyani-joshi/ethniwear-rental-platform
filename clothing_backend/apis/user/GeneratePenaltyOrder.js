const { ObjectId } = require("mongodb");
const Razorpay = require("razorpay");
const connectDB = require("../../db/dbConnect");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

async function GeneratePenaltyOrder(req, res) {

  try {

    const { order_id } = req.body;

    if (!order_id) {
      return res.status(400).json({
        success: false,
        message: "Order ID required"
      });
    }

    const db = await connectDB();

    const order = await db.collection("rental_orders").findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(req.user._id)
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    if (!order.penalty_amount || order.penalty_amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "No penalty available"
      });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: order.penalty_amount * 100,
      currency: "INR",
      receipt: `penalty_${order_id}`
    });

    return res.status(200).json({
      success: true,
      data: {
        order_id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        rental_order_id: order_id
      }
    });

  } catch (error) {

    console.log("GENERATE PENALTY ORDER ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

}

module.exports = { GeneratePenaltyOrder };