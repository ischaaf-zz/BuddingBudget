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
  period: String,
  start: Date,
  holdout: Number,
  isConfirm: Boolean
});

var ChargeEntry = new Schema({
  name: String, 
  amount: Number,
  period: String,
  start: Date,
  isConfirm: Boolean
});

var TrackEntry = new Schema({
  budget: Number,
  amount: Number,
  day: Date
});

// var OptionsEntry = new Schema ({
//   isNotify: Boolean,
//   notifyTime: Date,
//   isTrack: Boolean
// });

var UserSchema = new Schema ({
  username: {type: String, index: {unique: true, dropDups: true}},
  name: {type: String, required: true},
  password: {type: String, required: true},
  lastModified: {type: Number, required : true},
  data: {
    assets: Number,
    endDate: Number,
    rollover: Number,
    tomorrowRollover: Number,
    savings: [SavingsEntry],
    income: [IncomeEntry],
    charges: [ChargeEntry],
    entries: [TrackEntry],
    options: { 
      isNotifyMorning: String,
      isNotifyNight: String,
      isNotifyAssets: String,
      isEnableTracking: String,
      notifyMorningTime: Number,
      notifyNightTime: Number,
      notifyAssetsPeriod: String,
      minDailyBudget: Number
    }
  }
});

module.exports = mongoose.model('User', UserSchema);