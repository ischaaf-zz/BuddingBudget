var User = {
  username: {type: String, index: true, unique: true},
  name: {type: String, required: true},
  password: {type: String, required: true},
};