const userModel = require("../models/userModel")
const todoModel = require('../models/todoModel')
const mongoose = require('mongoose')
const redis = require('redis')
const { promisify } = require("util");

 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
 const redisClient = redis.createClient(
    13190,
    "redis-13190.c301.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("gkiOIPkytPI3ADi14jHMSWkZEo2J5TDG", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });
  
  //Connection setup for redis
  
  const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
  const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const isValidTitle = (title) => {
    return /^[A-Za-z0-9\s\-_,\.;@!:()]+$/.test(title.trim())

};


let createTodo = async (req, res) => {
   try {
        let data = req.body
        if (Object.keys(data).length == 0) {
            return res.status(400).send({ status: false, message: "Please Enter Some Details" });
        }
        let { userId, title, date, isDeleted } = data

        if (!userId) {
            res.status(400).send({ status: false, message: "UserId is required" })
        }
        let isValiduserId = mongoose.Types.ObjectId.isValid(userId);  //return true or false


        if (!isValiduserId) {
            return res.status(400).send({ status: false, message: "userId is Not Valid" });
        }

        const finduserId = await userModel.findById(userId) //give whole data

        if (!finduserId) {
            return res.status(404).send({ status: false, message: "userId not found" })
        }

        if (!title) {
            return res.status(400).send({ status: false, message: "Title is required" });
        }



        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Invalid format of Title", });
        }

        if (isDeleted) {
            if (typeof (isDeleted) != "boolean") {
                return res.status(400).send({ status: false, message: "Invalid Input of isDeleted.It must be true or false " });
            }
            if (isDeleted == true) {
                return res.status(400).send({ status: false, message: "isDeleted must be false while creating todo" });
            }
        }

        const todo = {
            userId: userId,
            title: title,
            date: date

        }
        let cacheData =await GET_ASYNC(title)
        console.log(cacheData)
        let jsonData=JSON.parse(cacheData)
        console.log(jsonData)
        if (jsonData) {
  
            return res.status(200).send({ status: true, data: jsonData })
               }

               let uniqueTitle = await todoModel.findOne({title:title})
               if(uniqueTitle){
                await SET_ASYNC(`${title}`, JSON.stringify(uniqueTitle))
                return res.status(200).send({ status: true, data: uniqueTitle })
               }


        let newTodo = await todoModel.create(todo)
        await SET_ASYNC(`${todo}`, JSON.stringify(todo))
        return res.status(201).send({ status: true, message: "Todo created successfully", data: newTodo });
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })

    }
}

//get/todo 
// pagination page ,pagesize
const getTodos = async (req, res) => {


    try {
      
        const page = req.query.page ? parseInt(req.query.page) : 0
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 0
        const todos = await todoModel.find({}).limit(pageSize).skip(pageSize * page);
        res.status(200).send({ count:todos.length,status: true, data: todos});
        return todos;

    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })

    }


}


module.exports = { createTodo, getTodos }