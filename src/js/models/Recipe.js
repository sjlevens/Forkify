import axios from 'axios';
import {key} from '../config';

export default class Recipe{
    constructor(id){
        this.id = id;
        
    }

    async getRecipe(){
        
        try{
            const res =  await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);

            this.title =res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }catch(error){
            alert(error);
        }
    }

    calcTime(){
        //Need 10 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng/3);
        this.time = periods*10;
    }

    parseIngredients(){

        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const newIngredients = this.ingredients.map(el => {
            //Uniform units

            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                if (ingredient === unit){
                    ingredient = ingredient.replace(unit, unitsShort[i]);
                };
            });
            //Remove Parentheses
            ingredient.replace(/ *\([^)]*\) */g, '');

            //Parse ingredients in to count, unit and ingredient


            return ingredient;


        });
        this.ingredients = newIngredients;
    }

    calcServings(){
        this.servings = 4;
    }
}