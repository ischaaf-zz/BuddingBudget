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
  amount: Number,
  day: {type: String, index: true, unique: true}
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