import { Types } from "mongoose";
import { Product } from "../model/product.model.js";


export const saveProducts = async (request, response, next) => {
    try {
        let productList = request.body;

        for (let product of productList) {
            await Product.create(product);
        }
        return response.status(200).json({ message: "All Data Saved Successfully.." });

    } catch (err) {

        return response.status(500).json({ Error: "Internal Server Error.." });
    }
}

export const GetAllProducts = async (request, response, next) => {
    Product.find()
        .then(result => {
            return response.status(201).json({ message: "All data fetch successfully...",result });
        }).catch(err => {
            return response.status(500).json({ Error: "Internal Server Error.." });
    })
}