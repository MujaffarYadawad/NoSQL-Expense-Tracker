const User = require("../models/signup");


exports.getUserLeaderBoard = async (req, res) => {
  try {
    const leaderboardusers = await User.aggregate([
      {
        $lookup: {
          from: "expenses",
          localField: "_id",
          foreignField: "userId",
          as: "expenses",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          total_cost: { $sum: "$expenses.expenseAmount" },
        },
      },
      {
        $sort: {
          total_cost: -1,
        },
      },
    ]);
   
// console.log('learderbord --', leaderboardusers)

// leaderboardusers.forEach((user) => {
//   console.log(`User: ${user.name}, Total Expenses: ${user.total_cost}`);
//});
      res.status(200).json(leaderboardusers);
   
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};



