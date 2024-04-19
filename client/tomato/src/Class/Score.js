export class Score{
    constructor() {
    if(!Score.instance){
        this.score = 0;
        Score.instance = this;
        }
    }  
    
    increaseScore(){
        this.score++;
    }
    resetScore(){
        this.score = 0;
    }
    getScore(){
        return this.score;
    }
}