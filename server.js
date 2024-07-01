const mongoose=require('mongoose');
const dotenv=require('dotenv');
var express= require('express');
var bodyParser= require('body-parser');

var app= express()
// charge les variables d'environnement 
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const getDataFromXlsx=require('./GetData/getDataFromXlsx');
var XLSX = require("xlsx");
var workbook = XLSX.readFile("./fixtures/plomberie/Questionnaire plomberie.xlsx");

async function main() {    
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
    reponses:[]
});

//Liaison du Schema avec un Modele DoimaineBd
const DomaineBd=mongoose.model('DomaineBd',domaineSchema);

//Liaison du Schema avec un Modele User
const User=mongoose.model('User',userSchema);

// Insert les données provenant du fichier xlsx en masse 
async function saveData(){
    await DomaineBd.insertMany(dataSet);        
    console.log("InsertMany done ...");
}

//Crée une intance de type User avec les informations de l'utilisateur et le persiste dans la bd
async function saveUserData(userdata){
    const user= new User({
        prenom: userdata.prenom ,
        nom: userdata.nom,
        adresse: userdata.adresse,
        codePostal: userdata.codePostal,
        telephone: userdata.telephone,
        email: userdata.email,
        reponses: userdata.reponses
    });
    await user.save();       
    console.log("Userdata seved!: ",user);     
}

async function getDomainesData(){    
    const domaines = await DomaineBd.find().limit(6);        
    return domaines;        
}


const dataSet=getDataFromXlsx(workbook);
saveData();

//Middlewares
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
var cors = require('cors');
app.use(cors());

//Authentification par clé SECRETE
function authentification(req,res,next){
    const authHeader=req.headers['authorization'];
    const token= authHeader && authHeader.split(' ')[1];    
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

//Route securisée par le middleware d'authentification pour les données de chaque domaine
app.get('/projetgoweb/domaines',authentification,(request, response)=>{
    
    console.log("GET DOMAINES!!!!");
    getDomainesData().then((reponsedata)=>{        
        response.send(reponsedata);
    });    
})

// Route securisée par le middleware d'authentification pour la demande d'une itervention
app.post('/projetgoweb/intervention',authentification,(request,response)=>{    
    try{
        saveUserData(request.body).then((reponsedata)=>{            
            response.sendStatus(200);
        });

    }catch(error){
        response.sendStatus(500);
    }
    
})

app.listen(8080);
console.log("Listen to the port 8080 ..");

