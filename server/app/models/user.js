var mongoose   = require('mongoose');

// build the schema
var Schema     = mongoose.Schema;


var SavingsEntry = new Schema({
  name: String,
  amount: Number,
  isDefault: Boolean
});

var IncomeEntry = new Schema({
  name: String,
  amount: Number,
  period: Number,
  start: Date,
  holdout: Number,
  isConfirm: Number
});

var ChargeEntry = new Schema({
  name: String,
  amount: Number,
  period: Number,
  start: Date,
  isConfirm: Boolean
});

var TrackEntry = new Schema({
  budget: Number,
  spent: Number,
  date: Date
});

var OptionsEntry = new Schema ({
  isNotify: Boolean,
  notifyTime: Date,
  isTrack: Boolean
});

var UserSchema = new Schema ({
  username: String,
  name: String,
  password: String,
  data: {
    budget: Number,
    assets: Number,
    endDate: Date,
    savings: [SavingsEntry],
    income: [IncomeEntry],
    charges: [ChargeEntry],
    entries: [TrackEntry],
    options: OptionsEntry
  }
});

module.exports = {
    Savings: mongoose.model('Savings', SavingsEntry),
    Income: mongoose.model('Income', IncomeEntry),
    Charge: mongoose.model('Charge', ChargeEntry),
    Track: mongoose.model('Track', TrackEntry),
    Options: mongoose.model('Options', OptionsEntry),
    User: mongoose.model('User', UserSchema)
};