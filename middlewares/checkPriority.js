
exports.updatePriority = async (req, res, next) => {
  try {
    const {due_date} = req.body;
    console.log(due_date);
    const currentDate = new Date();
    const timeDifference = new Date(due_date).getTime() - currentDate.getTime();
    const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));
    if (differenceInDays <= 1) {
      req.body.priority = 0;
    } else if (differenceInDays <= 2) {
      req.body.priority = 1;
    } else if (differenceInDays <= 4) {
      req.body.priority = 2;
    } else {
      req.body.priority = 3;
    }

   next();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};