const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function RequestReturn(req, res) {

  try {

    const { order_id } = req.body;

    console.log("ORDER ID =>", order_id);

    const db = await connectDB();

    const order = await db.collection("rental_orders").findOne({
      _id: new ObjectId(order_id),
      user_id: new ObjectId(req.user._id)
    });

    console.log("FOUND ORDER =>", order);

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

    const today = new Date();

    const returnDate = new Date(order.return_date);

    console.log("TODAY =>", today);

    console.log("RETURN DATE =>", returnDate);

    const diffTime =
      today.getTime() - returnDate.getTime();

    console.log("DIFF TIME =>", diffTime);

    const lateDays = Math.ceil(
      diffTime / (1000 * 60 * 60 * 24)
    );

    console.log("LATE DAYS =>", lateDays);

    let penaltyAmount = 0;

    let orderStatus = "Return Requested";

    if (lateDays > 0) {

      penaltyAmount = lateDays * 200;

      orderStatus = "Late";

    }

    console.log("PENALTY =>", penaltyAmount);

    console.log("STATUS =>", orderStatus);

    const updateResult =
      await db.collection("rental_orders").updateOne(

        {
          _id: new ObjectId(order_id)
        },

        {
          $set: {

            status: orderStatus,

            return_requested_at: new Date(),

            late_days: lateDays > 0
              ? lateDays
              : 0,

            penalty_amount: penaltyAmount,

            penalty_status:
              penaltyAmount > 0
                ? "Pending"
                : "Not Required"

          }
        }

      );

    console.log("UPDATE RESULT =>", updateResult);

    const updatedOrder =
      await db.collection("rental_orders").findOne({
        _id: new ObjectId(order_id)
      });

    console.log("UPDATED ORDER =>", updatedOrder);

    return res.status(200).json({

      success: true,

      message:
        penaltyAmount > 0
          ? `Late return penalty ₹${penaltyAmount}`
          : "Return requested successfully"

    });

  } catch (error) {

    console.log("REQUEST RETURN ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

}

module.exports = { RequestReturn };