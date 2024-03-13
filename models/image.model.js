import { Schema, model, models } from 'mongoose';

const ImageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  md5: {
    type: String,
    required: true,
    unique: true,
  },
});
ImageSchema.set('timestamps', true);

const Model = models.Image || model('Image', ImageSchema);
export default Model;
