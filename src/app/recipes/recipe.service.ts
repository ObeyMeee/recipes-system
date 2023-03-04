import { Injectable } from '@angular/core';
import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  _recipes: Recipe[] = [];

  recipesChanged = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {}

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
    return this.recipes.find((recipe) => recipe.id === id)!;
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

  delete(id: number): void {
    this._recipes.splice(this.findIndex(id), 1);
    this.triggerRecipesChangedEvent();
  }

  private triggerRecipesChangedEvent() {
    this.recipesChanged.next(this.recipes.slice());
  }

  private findIndex(id: number): number {
    return this.recipes.findIndex((rec) => id === rec.id);
  }
}
