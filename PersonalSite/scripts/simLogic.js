// Author Jadd, Nov 8 2020


var demographics = [[' ', 'Aggro', 'Intelli']]

// To create multiple objects with random values for diversity
var entities = [];
function startSim() {    
    for (var i = 0; i < 5; i += 1) {
        entities.push(new entityObj(
            Math.floor((Math.random() * 9)) * 100,
            Math.floor((Math.random() * 6)) * 100,
            Math.floor(Math.random() * 9) + 1,
            Math.floor(Math.random() * 9) + 1
            ));}
    simCanvas.draw();
}

//--------------------------------------------------------------
// To create the scene in the html page and adjust its attributes
var simCanvas = {
    
    canvas : document.createElement("canvas"),
    draw : function() {
        
        this.canvas.width = 1000;
        this.canvas.height = 700;       
        this.context = this.canvas.getContext("2d");
        
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateFrame, 200);
    },
    
    destroy : function() {
        
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "#DDD";
        this.context.fillRect(0, 0, 1000, 700);
    }
}

//--------------------------------------------------------------
//--------------------------------------------------------------
// To create an object logic and movement
function entityObj(x, y, aggressive, intelli) {
    
    // The parameters are used to get the attributes from the predecessors
    this.aggressive = aggressive;
    this.intelli = intelli;
    this.gender = Math.floor((Math.random() * 2));
    
    if(this.gender == 0) {this.color = 'BLUE';}
    else {this.color = 'PINK';}

    this.x = x;
    this.y = y;
    
    
    
    //--------------------------------------------------------------
    // To move Randomly
    this.roam = function() {

        if(Math.floor(Math.random() * 4) == 0) {                 
            
            if(Math.floor(Math.random() * 2) == 0) {
                if(this.x-50 < 0) {this.x += 50;}
                else {this.x -= 50;}
            }
            else {
                if(this.x+50 > 950) {this.x -= 50;}
                else {this.x += 50;}
            }
            
            if(Math.floor(Math.random() * 2) == 0) {
                if(this.y-50 < 0) {this.y += 50;}
                else {this.y -= 50;}
            }
            else {
                if(this.y+50 > 650) {this.y -= 50;}
                else {this.y += 50;}
            }
        }       
        
        var ctx = simCanvas.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 50, 50);
    }
    
    
    
    //--------------------------------------------------------------
    //--------------------------------------------------------------
    // 'Logical' movement
    this.cognition = function(otherObj, reflex) {
        
        var selfLeft = this.x;
        var selfRight = this.x + 50;
        var selfTop = this.y;
        var selfBot = this.y + 50;
        
        var objLeft = otherObj.x;
        var objRight = otherObj.x + 50;
        var objTop = otherObj.y;
        var objBot = otherObj.y + 50;
        
        
        if(selfLeft == objLeft && selfTop == objTop && reflex.localeCompare("REPEL_ENTITY") == 0) {
            if(this.aggressive <= otherObj.aggressive) {
                if((this.aggressive+(10-otherObj.aggressive))/2 >= Math.floor((Math.random() * 100))){return "DEATH";}
            }
            else if(5 == Math.floor((Math.random() * 100))) {return "DEATH";}
        }
        if(selfLeft == objLeft && selfTop == objTop && reflex.localeCompare("ATTRACT_ENTITY") == 0) {
            if(1 == Math.floor(Math.random() * 3)){return 'REPRODUCE';}
        }
        
        if(this.intelli >= Math.floor((Math.random() * 60))) {
            
            if((selfLeft-50 < (objLeft+objRight)/2 < selfRight+50) && (selfBot <= objTop <= selfBot+100)) {   

                if(reflex.localeCompare("ATTRACT_ENTITY") == 0 || reflex.localeCompare("ATTRACT_INANIM") == 0) {
                    if(this.y+50 < 650) {this.y += 50;}
                }
                
                if(reflex.localeCompare("REPEL_ENTITY") == 0 || reflex.localeCompare("REPEL_INANIM") == 0) {
                    if(this.y-50 > 0) {this.y -= 50;}
                }
            }    
            if((selfLeft-50 < (objLeft+objRight)/2 < selfRight+50) && (selfTop <= objBot <= selfTop+100)) {  

                if(reflex.localeCompare("ATTRACT_ENTITY") == 0 || reflex.localeCompare("ATTRACT_INANIM") == 0) {
                    if(this.y-50 > 0) {this.y -= 50;}
                }
                if(reflex.localeCompare("REPEL_ENTITY") == 0 || reflex.localeCompare("REPEL_INANIM") == 0) {
                    if(this.y+50 < 650) {this.y += 50;}      
                }
            }
            if((selfTop-50 < (objTop+objBot)/2 < selfBot+50) && (selfRight <= objLeft <= selfRight+100)){ 
                
                if(reflex.localeCompare("ATTRACT_ENTITY") == 0 || reflex.localeCompare("ATTRACT_INANIM") == 0) {
                    if(this.x+50 < 950) {this.x += 50;}
                }              
                if(reflex.localeCompare("REPEL_ENTITY") == 0 || reflex.localeCompare("REPEL_INANIM") == 0) {
                    if(this.x-50 > 0) {this.x -= 50;}
                }
            }
            if((selfTop-50 < (objTop+objBot)/2 < selfBot+50) && (selfLeft <= objRight <= selfLeft+100)){  
                
                if(reflex.localeCompare("ATTRACT_ENTITY") == 0 || reflex.localeCompare("ATTRACT_INANIM") == 0) {
                    if(this.x-50 > 0) {this.x -= 50;}
                }
                if(reflex.localeCompare("REPEL_ENTITY") == 0 || reflex.localeCompare("REPEL_INANIM") == 0) {
                    if(this.x+50 < 950){this.x += 50;}
                }     
            }

            var ctx = simCanvas.context;
            ctx.fillStyle = this.color;
            ctx.fillRect(this.x, this.y, 50, 50);
            return 'hasMoved';
        }
        else {return 'hasNotMoved';}
    }
}



//--------------------------------------------------------------
//--------------------------------------------------------------
//--------------------------------------------------------------
// To create the continuity of processes and logic
// This function scans through all objects and based on there attributes will take certain actions on them
function updateFrame() {
    
    simCanvas.destroy();
    for (var i = 0; i < entities.length; i++) {
    
        var toRoam = 1;
        for (var j = 0; j < entities.length; j += 1) {
            
            if(i != j){
                
                var result = "NULL";
                // Object of 'opposite' gender attract
                if(entities[i].gender != entities[j].gender) {result = entities[i].cognition(entities[j], "ATTRACT_ENTITY");}
                else {result = entities[i].cognition(entities[j], "REPEL_ENTITY");}
                
                if(result.localeCompare("DEATH") == 0) {
                    entities.splice(i, i);
                    i -= 1;
                    toRoam = false;
                    break;
                }
                
                // Logic of where to place spawn if objects 'reproduce'
                if(result.localeCompare("REPRODUCE") == 0){
                    
                    var spawnX =entities[i].x, spawnY =entities[i].y;
                    if(Math.floor(Math.random() * 2) == 0) {
                        if(entities[i].x-50 < 0) {spawnX += 50;}
                        else {spawnX -= 50;}
                    }
                    else {
                        if(entities[i].x+50 > 950) {spawnX -= 50;}
                        else {spawnX += 50;}
                    }

                    if(Math.floor(Math.random() * 2) == 0) {
                        if(entities[i].y-50 < 0) {spawnY += 50;}
                        else {spawnY -= 50;}
                    }
                    else {
                        if(entities[i].y+50 > 650) {spawnY -= 50;}
                        else {spawnY += 50;}
                    }
                    
                    entities.push(new entityObj(
                        spawnX,
                        spawnY,
                        (entities[i].aggressive + entities[j].aggressive)/2 ,
                        (entities[i].intelli + entities[j].intelli)/2
                        ));
                    break;
                }
                // 'toRoam' variable is to determine whether logical/random movement was applied
                if(result.localeCompare("hasMoved") == 0) {
                    toRoam = false;
                    break;
                }
            }  
        }
        if(toRoam == true) {entities[i].roam();}
    }
    
    // To visualize data
    var aggre = 0;
    var intelli = 0;
    for (var a = 0; a < entities.length; a++) {
        aggre += entities[a].aggressive;
        intelli += entities[a].intelli;
    }
    
    var aggroScore = Math.round((aggre/entities.length + Number.EPSILON) * 100) / 100
    var intelliScore = Math.round((intelli/entities.length + Number.EPSILON) * 100) / 100
    
    demographics.push([' ', aggroScore, intelliScore]);
    if(demographics.length >= 50) {demographics.splice(1, 2);}
    
    var demgrphTitle = 'Aggro: ' + aggroScore + ', Intelli: ' + intelliScore; 
    drawChart(demographics, demgrphTitle, 'demgrph');
}