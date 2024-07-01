var dataSet=[];

function compareNombre(a,b){                            
    var ints=a.split('').map((e)=>e.charCodeAt(0));
    var intbs=b.split('').map((e)=>e.charCodeAt(0));                        
    return parseInt(ints.toString().replaceAll(',',''))-parseInt(intbs.toString().replaceAll(',',''));
}

function createDataSet(workbook){
    var domaine;    
    var questionnaire={
        'B':[],
        'C':{},
        'D': {}
    };

    var Keys=[];

    /* un exemple de la représentation de données du fichier xlsx 
    workbook={
        'SheetNames':['namex','namey']
        'Sheets':{
            namex:{},
            namey:{}
        }  
    }    
    */

    workbook.SheetNames.map((name)=>{        
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
        var category=""
        var isQuestionExist=false;        
        var cpt=0;
        Keys.map((key)=>{
            isQuestionExist=false;
            if(cpt==2)cpt=0;
            if(key!=domainekey & !key.includes('!')){            
                category=key[0];                
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



