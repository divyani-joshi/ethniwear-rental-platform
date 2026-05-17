const { ObjectId } = require("mongodb");
const crypto = require("crypto");
const connectDB = require("../../db/dbConnect");

async function VerifyPenaltyPayment(req, res) {

  try {

    const {
      order_id,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    } = req.body;

    const generatedSignature = crypto
      .createHmac(
        "sha256",
        process.env.RAZORPAY_KEY_SECRET
      )
      .update(
        `${razorpay_order_id}|${razorpay_payment_id}`
      )
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature"
      });
    }

    const db = await connectDB();

    await db.collection("rental_orders").updateOne(
      {
        _id: new ObjectId(order_id)
      },
      {
        $set: {
          penalty_status: "Paid",
          penalty_paid_at: new Date()
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Penalty payment successful"
    });

  } catch (error) {

    console.log("VERIFY PENALTY ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

}

module.exports = { VerifyPenaltyPayment };