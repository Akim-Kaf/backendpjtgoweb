var dataSet=[];

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

function createDataSet(workbook){
    var domaine;    
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
                                questionnaire[category].push({'id':key, 'domaine':domaine, 'question':cellulevalue,'reponses':[]});
                            }
                        }else{
                            questionnaire[category][key]={'id':key, 'domaine':domaine, 'question':cellulevalue,'reponses':[]};                                                                               
                            //questionnaire[category].push({'id':key,'question':cellulevalue,'reponses':[]});                                                                               
                        }                    
                            
                    }else{
                        if(category=="B"){
                            questionnaire[category].map((value)=>{
                                if(value['question']===question){
                                    isQuestionExist=true;
                                value['reponses'].push({'id':key, 'domaine':domaine, 'value':cellulevalue}) 
                                }
                            })
                            if(! isQuestionExist){
                                var tmpreponse=[]
                                tmpreponse.push({'id':key, 'domaine':domaine, 'value':cellulevalue});
                                questionnaire[category][key]={'domaine':domaine, 'question':cellulevalue, 'reponses':tmpreponse};                    
                            } 
                        }else{                        
                            if(category!="B"){                            
                                if(questionnaire[category][idQuestion]){                                
                                    questionnaire[category][idQuestion]['reponses'].push({'id':key,'domaine':domaine, 'value':cellulevalue});                                       
                                }                                                        
                            }                                                                                       
                        }                                                                                                                                            
                    }
                }                         
            }                        

        })    

        dataSet.push({'nom' : domaine, 'questionnaire': questionnaire});                
    })
    
    dataSet.push({'nom' : "Electricité", 'questionnaire' : []});
    dataSet.push({'nom' : "Chauffage", 'questionnaire' : []});
    dataSet.push({'nom' : "Serrurerie", 'questionnaire' : []});
    dataSet.push({'nom' : "Vitrerie",'questionnaire':[]});
    dataSet.push({'nom' : "Electroménager",'questionnaire':[]});
}

const getDataFromXlsx = (workbook) =>{
    createDataSet(workbook);
    return dataSet;
}

module.exports = getDataFromXlsx;



