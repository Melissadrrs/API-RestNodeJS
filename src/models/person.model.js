/**
 * person.model.js
 * Nos permite gestionar los datos de la colección people de MongoDB
 */
const mongoose = require("mongoose");

const schemaPreferences = new mongoose.Schema({
  hobby: {
    type: String,
    required: false,
  },
  color: {
    type: String,
    required: false,
  },
});

const schema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    eyeColor: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    company: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    preferences: {
      type: Object,
      of: [schemaPreferences],
      required: false,
    },
  },
  {
    collection: "people",
  }
);

const PersonModel = mongoose.model("PersonModel", schema);
module.exports = PersonModel;
