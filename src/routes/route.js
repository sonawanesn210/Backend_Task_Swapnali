const express =require('express')
const router = express.Router()
const {createuser} = require("../controllers/usercontroller");
const {createTodo,getTodos}=require('../controllers/todoController')

router.post("/register",createuser)



router.post('/add',createTodo)



router.get('/fetchAll',getTodos)



/* router.all('*',(req,res)=>{
    res.status(404).send({status:false,message:"Page not found"})
}) */


module.exports=router