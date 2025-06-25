import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    title: String,
    description: String,
    category: String,
    price: Number,
    discountPercentage: Number,
    rating: Number,
    stock: Number,
    brand: String,
    warrantyInformation: String,
    shippingInformation: String,
    availabilityStatus: String,
    reviews: [{
        rating: Number,
        comment: String,
        date: String,
        reviewerName: String,
        reviewerEmail: String
    }],
    returnPolicy: String,
    thumbnail: String
});
export const Product = mongoose.model("product", ProductSchema);