import Search from './models/Search';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

/*  Global state of the app
        -Search Object
        -Current Recipe Object
        -Shopping List Object
        -Liked Recipes
*/

const state = {};

/**Search Controller
 * 
 * 
 */
const controlSearch = async () => {
    // Get the query from the view
    const query = searchView.getInput();
    if(query){
        // New search object and add to state
        state.search = new Search(query);

        // Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchResultPanel);


        // Search for recipes
        try{
            await state.search.getResults();

            searchView.renderResults(state.search.recipes);

        }catch(error){

        }
        

        // Render results on UI
        clearLoader();
        
    }

}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResultPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.recipes, goToPage);
        
    }
})

/**Recipe Controller
 * 
 * 
 */



const controlRecipe = async () => {

    //Get ID from url
    const id = window.location.hash.replace('#','');
    //Testing
    console.log(id);
    

    if (id){
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        if (state.search) searchView.highlightSelected(id);
        
        //Get new recipe object
        state.recipe = new Recipe(id);

        try{
            //Get recipe data
            await state.recipe.getRecipe();

        }catch(error){
            alert(error);
        }

        //Calc recipe stats
        state.recipe.calcTime();
        state.recipe.calcServings();
  
        //Fix ingredients
        state.recipe.parseIngredients();

        //Render recipe
        clearLoader();
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));

    }
}

/**List Controller
 * 
 * 
 */

 const controlList = () => {
     if (!state.list) state.list = new List();

     //add each ingredient to the list
     state.recipe.ingredients.forEach(el => {
         const item = state.list.addItem(el.count, el.unit, el.ingredient);
         listView.renderItem(item);
     });
 }

 //Handling delete and update list item events
 elements.shopping.addEventListener('click', e => {
     const id = e.target.closest('.shopping__item').dataset.itemid;
     //console.log(e.target.closest('.shopping__item').dataset.itemid);

     //Delete button
     if (e.target.matches('.shopping__delete, .shopping__delete *')){
         //Delete state
         state.list.deleteItem(id);
         //Delete UI
         listView.deleteItem(id);
     }else if (e.target.matches('.shopping__count-value')){
         const val = parseFloat(e.target.value);
         state.list.updateCount(id, val);
     }
 });

 /**
 * Likes Controller
 * 
 */
//Testing
state.likes = new Likes();
likesView.toggleLikeMenu(state.likes.getNumberOfLikes);

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;
    //Check if liked or not
    if(!state.likes.isLiked(currentID)){
        //Not currently Liked

        //Add like to the state
        const newLike = state.likes.addLike(currentID, state.recipe.title, state.recipe.author, state.recipe.img);
        
        //Toggle the like button
        likesView.toggleLikeBtn(true);

        //Add like to UI list
        likesView.renderLike(newLike);

    }else{
        //Currently Liked

        //Remove like from state
        state.likes.deleteLike(currentID);
        //Toggle like button
        likesView.toggleLikeBtn(false);

        //Remove like from UI list
        likesView.removeLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
};


//Handling recipe loading
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//Handling recipe button clicks
elements.recipe.addEventListener('click', e =>{
    if (e.target.matches('.btn-decrease, .btn-decrease *')){
        //console.log('dec');
        //Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increse, .btn-increase *')){
        //increase button is clicked
        //console.log('inc');
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        //Like controller
        controlLike();
    }
})


