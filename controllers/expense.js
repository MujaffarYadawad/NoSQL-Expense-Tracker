const Expense = require("../models/expense");
 

exports.getAllExpense = async (req, res, next) => {
  try {
   // console.log('req user -->',req.user);

    let page = +req.query.page || 1;
//    console.log('page-->', page)
    let ITEMS_Per_Page = +req.query.expPerPage || 3;

const totalItems = await Expense.countDocuments({ userId: req.user[0]._id });
//console.log("total items -->", totalItems);

const expenses = await Expense.find({ userId: req.user[0]._id })
  .skip((page - 1) * ITEMS_Per_Page)
  .limit(ITEMS_Per_Page);

//console.log("Expenses:", expenses);

res.json({
  val: expenses,
  isPremium: req.user[0].isPremiumUser,
  currentPage: page,
  hasNextPage: totalItems > page * ITEMS_Per_Page,
  nextPage: page + 1,
  hasPreviousPage: page > 1,
  previousPage: +page - 1,
  lastPage: Math.ceil(totalItems / ITEMS_Per_Page)
 });
  } catch (err) {
    console.log(err);
  }
};

exports.postExpense = async (req, res, next) => {
  try {
    const expenseAmount = req.body.expenseAmount;
    const expenseDescription = req.body.expenseDescription;
    const category = req.body.category;

    const data = await Expense({
      expenseAmount: expenseAmount,
      expenseDescription: expenseDescription,
      category: category,
      userId: req.user[0]._id,
    });
    data.save()
    console.log(data)
    res.json(data);
  } catch (err) {
    console.log(err);
  }
};

exports.deleteExpense = async (req, res, next) => {
   try {
     const expId = req.params.id;
     console.log('item id-->', expId)
     const result = await Expense.deleteOne({ _id: expId });
      res.status(200).json({ success: true, message: "Expense deleted successfully" });

   } catch (err) {
     console.log(err);
     res.status(500).json({ success: false, message: "Failed to delete expense" });
   }
};
