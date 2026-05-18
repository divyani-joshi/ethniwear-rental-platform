const { ObjectId } = require("mongodb");
const connectDB = require("../../db/dbConnect");

async function ReturnOrder(req, res) {

  try {

    const { id } = req.params;

    const db = await connectDB();

    const order = await db.collection("rental_orders").findOne({
      _id: new ObjectId(id)
    });

    if (!order) {

      return res.status(404).json({
        success: false,
        message: "Order not found"
      });

    }

   
    if (order.status === "Return Requested") {

      return res.status(400).json({
        success: false,
        message: "Return already requested"
      });

    }

    if (order.status === "Returned") {

      return res.status(400).json({
        success: false,
        message: "Order already returned"
      });

    }

    await db.collection("rental_orders").updateOne(
      {
        _id: new ObjectId(id)
      },
      {
        $set: {
          status: "Return Requested"
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: "Return request sent to admin"
    });

  } catch (error) {

    console.log("RETURN ORDER ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

}

module.exports = { ReturnOrder };