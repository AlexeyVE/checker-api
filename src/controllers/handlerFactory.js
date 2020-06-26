const catchAsync = require('../utils/cAsync');
const AppError = require('../utils/appError');

exports.deleteOne= Model => catchAsync(async (req, res, next) => {
  const doc = Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('Жодного документа з цим ID не знайдено', 404));
  }
  res.status(204).json({
    statusCode: 0,
    data: null
  });
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const doc = Model.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!doc) {
    return next(new AppError('Жодного документа з цим ID не знайдено', 404));
  }
  return res.status(200).json({
    action: 'Update document',
    statusCode: 0,
    doc
  });
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
  let query = Model.findById(req.params.id);
  if (popOptions) query = query.populate(popOption); //popOptions = {path:'',select:+-}
  const doc = await query;
  if (!doc) {
    return next(new AppError('Жодного документа з цим ID не знайдено', 404));
  }
  res.status(200).json({
    action: 'Get one document',
    statusCode: 0,
    doc
  });
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.find();  
  res.status(200).json({
    action: "Get all",
    statusCode: 0,
    results: doc.length,
    doc
  });
});  

