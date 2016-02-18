var IncomeEntry = {
  name: {type: String, index: true, unique: true},
  amount: Number,
  period: Number,
  start: Date,
  holdout: Number,
  isConfirm: Boolean
};