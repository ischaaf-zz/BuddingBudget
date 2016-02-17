var mongoose   = require('mongoose');

// build the schema
var Schema     = mongoose.Schema;


var SavingsEntry = new Schema({
  name: {type: String, index: true, unique: true},
  amount: Number,
  isDefault: Boolean
});

var IncomeEntry = new Schema({
  name: {type: String, index: true, unique: true},
  amount: Number,
  period: String,
  start: Date,
  holdout: Number,
  isConfirm: Boolean
});

var ChargeEntry = new Schema({
  name: {type: String, index: true, unique: true},
  amount: Number,
  period: String,
  start: Date,
  isConfirm: Boolean
});

var TrackEntry = new Schema({
  budget: Number,
  spent: Number,
  date: {type: String, index: true, unique: true}
});

// var OptionsEntry = new Schema ({
//   isNotify: Boolean,
//   notifyTime: Date,
//   isTrack: Boolean
// });

var UserSchema = new Schema ({
  username: {type: String, index: true, unique: true},
  name: {type: String, required: true},
  password: {type: String, required: true},
  lastModified: {type: Date, required : true},
  data: {
    budget: Number,
    assets: Number,
    endDate: Date,
    savings: [SavingsEntry],
    income: [IncomeEntry],
    charges: [ChargeEntry],
    entries: [TrackEntry],
    userOptions: { 
      isNotifyMorning: Boolean,
      isNotifyNight: Boolean,
      isNotifyAssets: Boolean,
      notifyMorningTime: Number,
      notifyNightTime: Number,
      notifyAssetsPeriod: String
    }
  }
});

module.exports = mongoose.model('User', UserSchema);

// module.exports = {
//     Savings: mongoose.model('Savings', SavingsEntry),
//     Income: mongoose.model('Income', IncomeEntry),
//     Charge: mongoose.model('Charge', ChargeEntry),
//     Track: mongoose.model('Track', TrackEntry),
//     Options: mongoose.model('Options', OptionsEntry),
//     User: mongoose.model('User', UserSchema)
// };