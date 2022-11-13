const userModel = require("../models/userModel")


//create user

const createuser = async (req, res) => {
    try {
//EMAIL VALIDATION BY REJEX
const validateEmail = (email) => {
    return  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.trim());
  };


  //PASSWORD VALIDATION BY REJEX
  const validatePassword = (password) => {
    return  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/.test(password.trim());
  };


  //STRING VALIDATION BY REJEX
  const validatefeild = (name) => {
    return  /^[a-zA-Z]/.test(name.trim());
  };



  const data = req.body;
     if (Object.keys(data).length == 0) {
      return res.status(400).send({ status: false, message: "Please Enter Some Details" });
    } 


    if (!data.name) {
        return res.status(400).send({ status: false, message: "Name is missing" });
      }
  
      //Name validation by Rejex
      if (!validatefeild(data.name)) {
        return res.status(400).send({ status: false, message: "Invalid Name format", });
      }
  
      let validString = /\d/;
      if (validString.test(data.name.trim())) return res.status(400).send({ status: false, message: "Name must be valid it should not contains numbers" });
  


      if (!data.email) {
        return res.status(400).send({ status: false, message: "Email is missing" });
      }
  
      //email validation by Rejex
      if (!validateEmail(data.email)) {
        return res.status(400).send({ status: false, message: "Invaild E-mail id." });
      }
  
      const findemail = await userModel.findOne({ email: data.email }); //email exist or not
  
      if (findemail) {
        return res.status(400).send({ status: false, message: `${data.email} Email Id  Already Registered.Please,Give Another ID` })
      }
  
      if (!data.password) {
        return res.status(400).send({ status: false, message: "Password is missing" });
      }
  
      //password validation by Rejex
  
      if (!validatePassword(data.password)) {
        return res.status(400).send({ status: false, message: "Password should contain at-least one number,one special character and one capital letter", }); //password validation
      }


      const user = await userModel.create(data);
    return res.status(201).send({ status: true, message: "Success", data:user });
  }

  catch (err) {
    res.status(500).send({ status: false, error: err.message });
  }
};


  module.exports={createuser}
 