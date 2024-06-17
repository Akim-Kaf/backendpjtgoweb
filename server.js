var XLSX = require("xlsx");
var workbook = XLSX.readFile("./fixtures/plomberie/Questionnaire plomberie.xlsx");
var domaine;
var dataSet=[];

var questionnaire={
    'B':[],
    'C':{},
    'D': {}
};

var Keys=[];

/* workbook={
    'SheetNames':['namex','namey']
    'Sheets':{
        namex:{},
        namey:{}
    }  
  }
  
*/

function compareNombre(a,b){                            
    var ints=a.split('').map((e)=>e.charCodeAt(0));
    var intbs=b.split('').map((e)=>e.charCodeAt(0));                        
    return parseInt(ints.toString().replaceAll(',',''))-parseInt(intbs.toString().replaceAll(',',''));
}

function getNextQuestioKey(id){
    var resultat="";        
    if(id){
        if(id[0]=="B"){
            resultat=String.fromCharCode(id.charCodeAt(0)+1)+(parseInt(id.split(id[0])[1])-1).toString();
        }else{
            resultat=String.fromCharCode(id.charCodeAt(0)+1)+(parseInt(id.split(id[0])[1])).toString();        
        }            
    }
    
    return resultat;
}

workbook.SheetNames.map((name)=>{
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    console.log("------------------");
    const domainekey=Object.keys(workbook.Sheets[name])[1];
    domaine=workbook.Sheets[name][domainekey]['v'].trim();
    const Keysxls=Object.keys(workbook.Sheets[name]);    
        Keysxls.map((key)=>{
            if(!key.includes("!"))Keys.push(key.trim());
        })
        
    Keys.sort((a,b)=>compareNombre(a,b));
    Keys.sort((a,b)=>compareNombre(a[0],b[0]));    
    var question="";
    var idQuestion;
    var etiquette="";
    var category=""
    var isQuestionExist=false;
    //var labelctr=[];
    var cpt=0;
    Keys.map((key)=>{
        isQuestionExist=false;
        if(cpt==2)cpt=0;
        if(key!=domainekey & !key.includes('!')){
            if(key[0]==="B"){
                etiquette="lieu";
                category="B"
            }

            if(key[0]==="C"){
                etiquette="nature";
                category="C"
            }

            if(key[0]==="D"){
                etiquette="squestion";
                category="D"
            }
            
            var cellulevalue=workbook.Sheets[name][key]['v'].trim();                       
            if(cellulevalue.length>0){
                if(cellulevalue.includes('?')){                    
                    question=cellulevalue;                    
                    idQuestion=key;                    
                    if(category=='B'){                        
                        questionnaire[category].map((value)=>{
                            if(value['question']===cellulevalue){
                                isQuestionExist=true;                                
                            }                                                    
                        });  
                        if(!isQuestionExist){                            
                            questionnaire[category].push({'question':cellulevalue,'reponses':[]});
                        }
                    }else{
                        questionnaire[category][key]={'id':key,'question':cellulevalue,'reponses':[]};                                                                               
                        //questionnaire[category].push({'id':key,'question':cellulevalue,'reponses':[]});                                                                               
                    }                    
                        
                }else{
                    if(category=="B"){
                        questionnaire[category].map((value)=>{
                            if(value['question']===question){
                                isQuestionExist=true;
                               value['reponses'].push({'id':key,'value':cellulevalue}) 
                            }
                        })
                        if(! isQuestionExist){
                            var tmpreponse=[]
                            tmpreponse.push({'id':key,'value':cellulevalue});
                            questionnaire[category][key]={'question':cellulevalue,'reponses':tmpreponse};                    
                        } 
                    }else{                        
                        if(category!="B"){                            
                            if(questionnaire[category][idQuestion]){                                
                                questionnaire[category][idQuestion]['reponses'].push({'id':key,'value':cellulevalue});                                       
                            }                                                        
                        }                                                                                       
                    }                                                                                                                                            
                }
            }                         
        }                        

    })    

    dataSet.push({'name':domaine,'questionnaire':questionnaire});
})

console.log("Code of nex Q: ",getNextQuestioKey(""));
console.log("Domaine: ",domaine);
dataSet.push({'name':'Electricité','questionnaire':{}});
dataSet.push({'name':'Chauffage','questionnaire':{}});
dataSet.push({'name':'Serrurerie','questionnaire':{}});
dataSet.push({'name':'Vitrerie','questionnaire':{}});
dataSet.push({'name':'Electroménager','questionnaire':{}});

const mongoose=require('mongoose');

async function main() {
    console.log("Call.. connect bd ");
    await mongoose.connect('mongodb://127.0.0.1:27017/domaines');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main().catch(err => console.log(err));
console.log("Call connect bd done");

// definition d'un Schema
const domaineSchema=new mongoose.Schema({
    name: String,
    questionnaire:{
        'B':[],
        'C':{},
        'D': {}
    }
});

//Liaison du Schema avec un Modele
const DomaineBd=mongoose.model('DomaineBd',domaineSchema);

async function saveData(){
    await DomaineBd.insertMany(dataSet);
    //const kittens = await Kitten.find();
    console.log("Async inserMany done..");
}

console.log("Questionnaire: ",questionnaire);
console.log("Questionnaire ['C']: ",questionnaire['C']);
console.log("Dataset: ",dataSet);
saveData();




