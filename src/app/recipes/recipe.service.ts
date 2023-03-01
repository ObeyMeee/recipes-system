import {Injectable} from '@angular/core';
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/Ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {
  // private _recipes: Recipe[] = [
  //   new Recipe(
  //     'Tasty Schnitzel',
  //     'A super-tasty Schnitzel - just awesome!',
  //     'https://upload.wikimedia.org/wikipedia/commons/7/72/Schnitzel.JPG',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'Big Fat Burger',
  //     'What else you need to say?',
  //     'https://upload.wikimedia.org/wikipedia/commons/b/be/Burger_King_Angus_Bacon_%26_Cheese_Steak_Burger.jpg',
  //     [new Ingredient('Buns', 2), new Ingredient('Meat', 1)]
  //   )
  // ];
  private _recipes: Recipe[] = [];
  recipesChanged = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {

  }

  get recipes(): Recipe[] {
    return this._recipes.slice();
  }

  set recipes(recipes: Recipe[]) {
    this._recipes = recipes;
    this.triggerRecipesChangedEvent();
  }

  addIngredients(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(...ingredients);
  }

  getById(id: number): Recipe {
    return this.recipes.find(recipe => recipe.id === id)!;
  }

  save(recipe: Recipe) {
    const index = this.findIndex(recipe.id);
    if (index !== -1) {
      this._recipes[index] = recipe;
    } else {
      this._recipes.push(recipe);
    }
    this.triggerRecipesChangedEvent();
  }

  private triggerRecipesChangedEvent() {
    this.recipesChanged.next(this.recipes.slice());
  }

  delete(id: number): void {
    this._recipes.splice(this.findIndex(id), 1);
    this.triggerRecipesChangedEvent();
  }

  private findIndex(id: number): number {
    return this.recipes.findIndex(rec => id === rec.id);
  }
}
