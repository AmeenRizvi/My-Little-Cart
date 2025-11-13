import mongoose from "mongoose";
import dotenv from "dotenv";
import products from "./product.js";
import Product from "../model/product.model.js";

dotenv.config();

import connectDB from '../config/mongo.config.js'; // Adjust path
connectDB();

const importData = async () => {
    try{
        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("Data import successfully");
        process.exit();
    
    }
    catch(error){
        console.log(error);
        process.exit(1);
    }
}

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('🗑️ Data Destroyed Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error destroying data: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}