const connectDB = require("../../db/dbConnect");

const AddContact = async (req, res) => {
  try {

    const db = await connectDB();

    const collection = db.collection("contacts");

    const data = {
      full_name: req.body.full_name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
      createdAt: new Date(),
    };

    await collection.insertOne(data);

    res.send({
      success: true,
      message: "Message sent successfully",
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Internal server error",
    });

  }
};

const GetContacts = async (req, res) => {
  try {

    const db = await connectDB();

    const collection = db.collection("contacts");

    const contacts = await collection.find().toArray();

    res.send({
      success: true,
      contacts,
    });

  } catch (error) {

    console.log(error);

    res.status(500).send({
      success: false,
      message: "Internal server error",
    });

  }
};

module.exports = {
  AddContact,
  GetContacts,
};