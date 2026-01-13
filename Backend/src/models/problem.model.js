import mongoose from "mongoose";

const testCaseSchema = new mongoose.Schema(
  {
    input: {
      type: String,
      required: true,
    },
    expectedOutput: {
      type: String,
      required: true,
    },
    isHidden: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false }
);

const codeSnippetSchema = new mongoose.Schema(
  {
    language: {
      type: String,
      enum: ["javascript", "python", "java", "cpp"],
      required: true,
    },
    languageId: {
      type: Number,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    tags: [String],

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    constraints: String,

    examples: [
      {
        input: String,
        output: String,
        explanation: String,
      },
    ],

    testCases: {
      type: [testCaseSchema],
      required: true,
    },

    codeSnippets: {
      type: [codeSnippetSchema],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Problem", problemSchema);
