import { Router } from "express";
import userModel from "../Dao/models/users.js";
const router = Router();

router.post('/register', async (req, res) =>{

    const {first_name, last_name, email, age, password} = req.body;

    const exist = await userModel.findOne({email});
    if(exist){
        return res.status(400).send({status:"error", error:"User already exists"});
    }
    let rol= "user"
    const user = {
        first_name, last_name, email, age, password, rol
    };

    const result = await userModel.create(user);
    res.send({status:"succes", message:"User registered"});

})


router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({email,password})

    if(!user){
        return res.status(400).send({status:"error", error:"Incorrect data"})
    }
  
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol:user.rol
    }
    res.send({status:"success", payload:req.res.user, message:"first login", user: user.rol})
    
})

router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"can not log out"})
        res.redirect('/');
    })
})

export default router;