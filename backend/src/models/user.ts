import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  fid: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', schema);

export default User;
