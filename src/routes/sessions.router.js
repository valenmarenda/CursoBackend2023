import { Router } from "express";
import userModel from "../Dao/models/users.js";
import { createHash, validatePassword } from '../utils.js';
import passport from 'passport';
const router = Router();

/*
router.post('/register', async (req, res) =>{

    const {first_name, last_name, email, age, password} = req.body;

    const exist = await userModel.findOne({email});
    if(exist){
        return res.status(400).send({status:"error", error:"User already exists"});
    }
    let rol= "user"
    const user = {
        first_name, last_name, email, age, password: createHash(password), rol
    };

    const result = await userModel.create(user);
    res.send({status:"succes", message:"User registered"});

})*/

router.post('/register', passport.authenticate('register', { failureRedirect:'/failregister'} ),async (req, res) =>{

    res.send({status:"succes", message:"User registered"});

})
router.get('/failregister', async (req,res)=>{
    console.log('Registration failed');
    res.send({error: 'Registration failed'})
})
/*
router.post('/login', async (req,res)=>{
    const { email, password } = req.body;
    const user = await userModel.findOne({email})

    if(!user){
        return res.status(400).send({status:"error", error:"Incorrect data"})
    }
    const isValidPassword = validatePassword(password,user);
    if(!isValidPassword) return res.status(400).send({status:"error", error:"Incorrect data"})
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        rol:user.rol
    }
    res.send({status:"success", payload:req.res.user, message:"first login", user: user.rol})
    
})*/
router.post('/login', passport.authenticate('login',{failureRedirect:'/faillogin'}), async (req,res)=>{

    if(!req.user) return res.status(400).send({status:"error", error: 'Invalid credentials'});

    req.session.user = {
        firs_name : req.user.firs_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        rol: "user"
    }

    res.send({status:"success", payload:req.res.user, message:"first login" })
})

router.get('/faillogin', async (req,res)=>{

    console.log('failure to enter');
    res.send({error: 'Entry error'})

})


router.get('/logout', (req,res)=>{
    req.session.destroy(err =>{
        if(err) return res.status(500).send({status:"error", error:"can not log out"})
        res.redirect('/');
    })
})

router.post('/restartPassword', async (req, res)=>{
    const {email, password } = req.body;
    
    if(!email || !password ) return res.status(400).send({status:"error", error:"Incorrect data"})

    const user = await userModel.findOne({email});
    if(!user) return res.status(400).send({status:"error", error:"Incorrect data"})
    
    const newHashedPassword = createHash(password);

    await userModel.updateOne({_id:user._id},{$set:{password:newHashedPassword}});

    res.send({status:"success", message:"Updated password"})
})
router.get('/github', passport.authenticate('github', {scope:['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async (req,res)=>{

    req.session.user = req.user;
    res.redirect('/')

})

export default router;