

var SavingsEntry = {
  name: {type: String, index: true, unique: true},
  amount: Number,
  isDefault: Boolean
};

var IncomeEntry = {
  name: {type: String, index: true, unique: true},
  amount: Number,
  period: Number,
  start: Date,
  holdout: Number,
  isConfirm: Boolean
};

var ChargeEntry = {
  name: {type: String, index: true, unique: true},
  amount: Number,
  period: Number,
  start: Date,
  isConfirm: Boolean
};

var TrackEntry = {
  budget: Number,
  spent: Number,
  date: {type: String, index: true, unique: true}
};

// var OptionsEntry =  ({
//   isNotify: Boolean,
//   notifyTime: Date,
//   isTrack: Boolean
// });

var UserSchema = {
  username: {type: String, index: true, unique: true},
  name: {type: String, required: true},
  password: {type: String, required: true},
  data: {
    budget: Number,
    assets: Number,
    endDate: Date,
    savings: [SavingsEntry],
    income: [IncomeEntry],
    charges: [ChargeEntry],
    entries: [TrackEntry],
    userOptions: { 
      isNotify: Boolean,
      notifyTime: Date,
      isTrack: Boolean
    }
  }
};

//module.exports = mongoose.model('User', UserSchema);

// module.exports = {
//     Savings: mongoose.model('Savings', SavingsEntry),
//     Income: mongoose.model('Income', IncomeEntry),
//     Charge: mongoose.model('Charge', ChargeEntry),
//     Track: mongoose.model('Track', TrackEntry),
//     Options: mongoose.model('Options', OptionsEntry),
//     User: mongoose.model('User', UserSchema)
// };