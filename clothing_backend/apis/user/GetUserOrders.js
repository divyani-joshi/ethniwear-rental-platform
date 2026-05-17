const connectDB = require("../../db/dbConnect");

async function GetUserOrders(req, res) {

  try {

    const db = await connectDB();

    console.log("REQ USER =>", req.user);

    // Get current logged-in user orders
  const orders = await db
  .collection("rental_orders")
  .aggregate([
    {
      $match: {
        user_id: new ObjectId(req.user._id)
      }
    },
    {
      $lookup: {
        from: "clothing_items",
        localField: "item_id",
        foreignField: "_id",
        as: "item"
      }
    },
    {
      $unwind: "$item"
    }
  ])
  .toArray();

    console.log("ALL ORDERS =>", orders);

    return res.status(200).json({
      success: true,
      orders
    });

  } catch (error) {

    console.log("GET USER ORDERS ERROR =>", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });

  }

}

module.exports = { GetUserOrders };