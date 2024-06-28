const mongoose=require('mongoose');
const dotenv=require('dotenv');
var express= require('express');
var bodyParser= require('body-parser');

var app= express()
// charge les variables d'environnement depuis le fichier .env
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const getDataFromXlsx=require('./GetData/getDataFromXlsx');
var XLSX = require("xlsx");
var workbook = XLSX.readFile("./fixtures/plomberie/Questionnaire plomberie.xlsx");

async function main() {
    console.log("Call.. connect bd 1212 ");
    //local connexion url
    await mongoose.connect('mongodb://127.0.0.1:27017/domaines');
    //docker db connexion url
    //await mongoose.connect('mongodb://mongo:27017/domaines');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));
console.log("Call connect bd done");

// definition d'un Schema pour les domaines
const domaineSchema=new mongoose.Schema({
    nom: String,
    questionnaire:{
        'B':[],
        'C':{},
        'D': {}
    }
});

// definition d'un Schema pour les utilisateurs
const userSchema=new mongoose.Schema({
    prenom: String,
    nom: String,
    adresse: String,
    codePostal: String,
    telephone: String,
    email: String,
    responses:[]
});

//Liaison du Schema avec un Modele
const DomaineBd=mongoose.model('DomaineBd',domaineSchema);
//Liaison du Schema avec un Modele
const User=mongoose.model('User',userSchema);


async function saveData(){
    await DomaineBd.insertMany(dataSet);    
    const domaines = await DomaineBd.find();
    console.log("DATA:",domaines);
    console.log("Async inserMany done..");
}

async function saveUserData(userdata){
    const user= new User({
        prenom: userdata.prenom ,
        nom: userdata.nom,
        adresse: userdata.adresse,
        codePostal: userdata.codePostal,
        telephone: userdata.telephone,
        email: userdata.email,
        responses: userdata.responses
    });
    await user.save();       
    console.log("Userdata seved!: ",user);     
}

async function getDomainesData(){    
    const domaines = await DomaineBd.find().limit(6);
    console.log("Async Data get done");
    
    return domaines;        
}


const dataSet=getDataFromXlsx(workbook);
//console.log("Dataset: ",dataSet);
saveData();




//Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

function authentification(req,res,next){
    const authHeader=req.headers['authorization'];
    const token= authHeader && authHeader.split(' ')[1];
    console.log("Token:",token);
    console.log("SECRET_KEY:",SECRET_KEY);
    if(token == null)return res.sendStatus(401);

    if(token!==SECRET_KEY){
        return res.sendStatus(403);
    }
    next();
}

app.get('/projetgoweb/',(request,response)=>{
		console.log("************API TOOOOOOOOOOOOOO**************");
		response.send("API RUNING");
});

//Routes securise par le middleware d'authentification
app.get('/projetgoweb/domaines',authentification,(request, response)=>{
    
    console.log("GET DOMAINES!!!!");
    getDomainesData().then((reponsedata)=>{
        console.log("reponsedata: ",reponsedata);
        response.send(reponsedata);
    });    
})

app.post('/projetgoweb/intervention',authentification,(request,response)=>{
    console.log("Request posted: ",request.body);
    try{
        saveUserData(request.body).then((reponsedata)=>{
            console.log("reponsedata: ",reponsedata);
            response.sendStatus(200);
        });

    }catch(error){
        response.sendStatus(500);
    }
    
})

app.listen(8080);
console.log("Listen to the port 8080 ..");

