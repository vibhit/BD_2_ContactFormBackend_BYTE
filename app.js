const express=require("express");
const nodemailer=require("nodemailer");
const database=require("better-sqlite3");
require("dotenv").config();

const app=express();
app.use(express.json());
const db=new database('contacts.db');

db.exec(`CREATE TABLE IF NOT EXISTS contacts
    (id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP)
`);

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

transporter.verify((error,success)=>{
    if (error){
        console.log("Email configuration error",error);
    }else{
        console.log("Email configuration success",success);
    }
})

app.post("/contact",async(req,res)=>{
    try{
        const{name,email,message}=req.body;
        if(!name || !email ||!message){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email'
            });
        }


        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:process.env.EMAIL_USER,
            replyTo: email,
            subject:`contact Form from ${name}`,
            html: `<h2> New contact form</h2>
                    <p><strong>Name:</strong>${name}</p>
                    <p><strong>Email:</strong>${email}</p>
                    <p><strong>Message:</strong></p>
                    <p>${message}</p> `
        });

        const stmt=db.prepare(
            'INSERT INTO contacts (name,email,message) VALUES(?,?,?)'
        );
        const result=stmt.run(name,email,message);
        res.status(200).json({
            success:true,
            message:"email sent succesfully",
            id:result.lastInsertRowid
        });

    } catch (error){
    console.error("error:",error)
    res.status(500).json({
        success:false,
        message:"service error"
    });
    }
});

app.get('/contacts', (req, res) => {
    try {
        const contacts = db.prepare('SELECT * FROM contacts').all();
        res.json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});

app.listen(3000,() =>{
    console.log("server is running")
});

