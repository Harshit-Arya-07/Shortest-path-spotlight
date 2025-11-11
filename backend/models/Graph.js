import mongoose from 'mongoose';

const graphSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    nodes: [
      {
        id: String,
        label: String,
        x: Number,
        y: Number,
      },
    ],
    edges: [
      {
        id: String,
        source: String,
        target: String,
        weight: Number,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Graph', graphSchema);
