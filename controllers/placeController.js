import places from "../models/places.js";

export const placename = async (req, res) => {
  const inputplace = req.query.p;
  //   console.log(inputplace);
  const regex = new RegExp(`^${inputplace}`, "i");

  try {
    const results = await places.find({ place_name: regex });
    res.json(results);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
};
