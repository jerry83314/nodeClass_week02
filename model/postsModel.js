const mongoose = require("mongoose");
const postsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "name 未填寫"],
  },
  tags: [
    {
      type: String,
      required: [true, "tags 未填寫"],
    },
  ],
  type: {
    type: String,
    default: "未分類"
  },
  image: {
    type: String,
    default: "",
  },
  createAt: {
    type: Date,
    default: Date.now,
    select: false,
  },
  content: {
    type: String,
    required: [true, "content 未填寫"],
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
});

const posts = mongoose.model("posts", postsSchema);

module.exports = posts;