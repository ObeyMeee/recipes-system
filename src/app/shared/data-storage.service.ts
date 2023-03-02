import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Recipe} from "../recipes/recipe.model";
import {RecipeService} from "../recipes/recipe.service";
import {map, Observable, tap} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DataStorageService {
  private baseUrl = 'https://andromeda-bea2a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json';

  constructor(private http: HttpClient,
              private recipeService: RecipeService) {
  }

  storeRecipes() {
    this.http.put<Recipe[]>(this.baseUrl, this.recipeService.recipes)
      .subscribe(console.log);
  }

  fetchRecipes(): Observable<Recipe[]> {
    const recipesObs = this.getRecipes();
    return recipesObs.pipe(
      map(this.addEmptyIngredientsArrayIfNotExists),
      tap(recipes => this.recipeService.recipes = recipes)
    );
  }

  private getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>(this.baseUrl);
  }

  private addEmptyIngredientsArrayIfNotExists(recipes: Recipe[]): Recipe[] {
    return recipes.map(recipe => {
      return {...recipe, ingredients: recipe.ingredients || []};
    });
  }
}
