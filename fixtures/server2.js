var XLSX = require("xlsx");
var workbook = XLSX.readFile("./fixtures/plomberie/Questionnaire plomberie.xlsx");

/* workbook={
    'SheetNames':['namex','namey']
    'Sheets':{
        namex:{},
        namey:{}
    }  
  }
    [
  'Directory',  'Workbook',
  'Props',      'Custprops',
  'Deps',       'Sheets',
  'SheetNames', 'Strings',
  'Styles',     'Themes',
  'SSF'
]

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
    /*
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
    console.log(name+":sheet:Keys:",Object.keys(workbook.Sheets[name]));    
    const noref=Object.keys(workbook.Sheets[name])[0];    
    console.log("no ref:",noref);
    console.log("noref value: ",workbook.Sheets[name][noref]);
    console.log("domaine:",domaine);
     */   
    const domainekey=Object.keys(workbook.Sheets[name])[1];
    const domaine=workbook.Sheets[name][domainekey];
    const Keys=Object.keys(workbook.Sheets[name]).sort();
    var dataSet={'domaine':[]};
    dataSet.domaine.push(domaine);            
    var questionnaire={
        'B':[],
        'C':[],
        'D': []
    };

    var questionnaire2={
        'B':[],
        'C':[],
        'D': []
    };
    var question="";
    var etiquette="";
    var category=""
    var isQuestionExist=false;
    var labelctr=[];
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
            
            var cellulevalue=workbook.Sheets[name][key]['v'];           
            var linenumber=parseInt(key.split(key[0])[1].trim());
            console.log("LINE: ",linenumber);
            labelctr[cpt]=linenumber;
            cpt++;
            var temptb=[];
                //temptb[linenumber]=cellulevalue;           
                console.log("key:",key);   
            questionnaire[category][linenumber]=cellulevalue;
            if(cellulevalue.length>0){
                if(cellulevalue.includes('?')){
                    console.log("base question: ",cellulevalue);                                                                                
                    question=cellulevalue;
                    questionnaire2[category].map((value)=>{
                        if(value['question']===cellulevalue){
                            isQuestionExist=true;
                            
                        }                                                    
                    });  
                    if(!isQuestionExist){
                        questionnaire2[category][key]={'question':cellulevalue,'reponses':[]};
                    }                                   
                }else{
                    
                    console.log("concerne la question: ",question);
                    questionnaire2[category].map((value)=>{
                        if(value['question']===question){
                            isQuestionExist=true;
                           value['reponses'].push({'id':key,'value':cellulevalue}) 
                        }
                    })
                    if(! isQuestionExist){
                        var tmpreponse=[]
                        tmpreponse.push({'id':key,'value':cellulevalue});
                        questionnaire2[category][key]={'question':cellulevalue,'reponses':tmpreponse};                    
                    }                                        
                }
            }                         
        }        
        //console.log(" values:",workbook.Sheets[name][key]);    
        

    })    
    console.log("Questionnaire2: ",questionnaire2);
    /*
    console.log("Questionnaire B question: ",questionnaire2['B'][0]['question']);
    console.log("Questionnaire B reponses: ",questionnaire2['B'][0]['reponses']); 
    console.log("Questionnaire C question: ",questionnaire2['C'][0]['question']);
    console.log("Questionnaire C reponses: ",questionnaire2['C'][0]['reponses']);
    console.log("Questionnaire C1 question: ",questionnaire2['C'][1]['question']);
    console.log("Questionnaire C1 reponses: ",questionnaire2['C'][1]['reponses']);
    console.log("Questionnaire C2 question: ",questionnaire2['C'][2]['question']);
    console.log("Questionnaire C2 reponses: ",questionnaire2['C'][2]['reponses']);
    //console.log("Questionnaire C3 question: ",questionnaire2['C'][3]['question']);
    //console.log("Questionnaire C3 reponses: ",questionnaire2['C'][3]['reponses']); 
    console.log("Questionnaire D question: ",questionnaire2['D'][0]['question']);
    console.log("Questionnaire D reponses: ",questionnaire2['D'][0]['reponses']);
    console.log("Questionnaire D1 question: ",questionnaire2['D'][1]['question']);
    console.log("Questionnaire D1 reponses: ",questionnaire2['D'][1]['reponses']);
    console.log("Questionnaire D2 question: ",questionnaire2['D'][2]['question']);
    console.log("Questionnaire D2 reponses: ",questionnaire2['D'][2]['reponses']);   
    //const Keys=Object.keys(workbook.Sheets[name]);
    //console.log(name+":sheet:"+domaine); 
    */
    /*
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[name]);
    console.log("Questionnaire: ",questionnaire);
    var reper=[];
    var val="";

    for(let i=0;i<questionnaire['B'].length;i++){                
        if (questionnaire['B'][i]){
            console.log("VVVV:",questionnaire['B'][i]+"  :"+i);
            if(questionnaire['B'][i].includes('?')){                
                val="B"+(i+1);            
                console.log("=>>>>>>>>>>>>>>>>>>: ",val+" i: "+i);
                reper[val]=i;           
            }else{
                console.log("YESSSSS:",questionnaire['B'][i]+"  :"+i);
                if(questionnaire['B'][i-1].includes('?')){
                    //val='B'+(i-1);
                    console.log("Val yes:",val+" i to ins: "+i);
                    console.log("REPER now: ",reper);
                    console.log("reper Val :",reper[val]+" i to ins: "+i);
                    reper[val]=i;           
                    console.log("reper Val AFTER :",reper[val]+" i to ins: "+i);
                    console.log("REPER AFTER now: ",reper);
                }
            }
            //reper[val]=i;           
        }else{
            
            if(val){
                console.log("Val ask change: "+val +" i asoos:"+i);                                
                reper[val]=i;
            }            
        }                    
    }

    val="";
    
    console.log("LAST REPER B: ",reper);
    
    for(let i=0;i<questionnaire['C'].length;i++){   
        console.log(questionnaire['C'][i]+": i C",i);                     
        if (questionnaire['C'][i]){
           //val='C'+(i);            
           ///if(questionnaire['C'][i].includes('?')){
            val='C'+(i);            
            console.log("VAL C: ",val);
           //}else{reper[val]=i;}
           reper[val]=i;           
        }/*else{
            
            if(val){                                
                reper[val]=i;
            }            
        }        
    }
    val="";
    
    for(let i=0;i<questionnaire['D'].length;i++){                
        if (questionnaire['D'][i]){
           //val='D'+(i);       
           if(questionnaire['D'][i].includes('?'))val='D'+(i);                 
           reper[val]=i;           
        }else{
            
            if(val){                                
                reper[val]=i;
            }            
        }
        val="";
    }
    console.log("REPER: ",reper);  
    console.log("Questionnaire: ",questionnaire);
    console.log("LEN B",questionnaire['B'].length);
    console.log("KEYS", Keys)
    
    var tb=[];
    tb[1]='kaf';
    console.log("tb:",tb);
    */

})
