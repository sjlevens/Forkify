import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';

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
    console.log(id);
    

    if (id){
        
        
        //Prepare UI for changes

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

        //Render recipe
        //Fix ingredients
        state.recipe.parseIngredients();
        console.log(state.recipe);

    }
}
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));



