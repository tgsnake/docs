import { Schema, model, models } from 'mongoose';
import slugify from 'slugify';

const BlogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  author: {
    type: Array,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
});
BlogSchema.set('timestamps', true);

BlogSchema.pre('validate', function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const Model = models.Blog || model('Blog', BlogSchema);
export default Model;
