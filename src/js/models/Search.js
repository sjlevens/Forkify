import axios from 'axios';
import {key} from '../config';


export default class Search{
    constructor(query){
        this.query = query;
    }

    async getResults(){
    
        
        try{
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.recipes = res.data.recipes;
            //console.log(this.recipes)
        }catch(error){
            alert(error);
        }
        
    
        
    
    
    
    }
}

//API Key 45b54fcf78efc44adc77aa88dc927f1e 
// Submitting a Query
// All search requests should be made to the search API URL.
// https://www.food2fork.com/api/search
// All recipe requests should be made to the recipe details API URL.
// https://www.food2fork.com/api/get 



