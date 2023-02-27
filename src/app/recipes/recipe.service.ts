import {Injectable} from '@angular/core';
import {Recipe} from "./recipe.model";
import {Ingredient} from "../shared/Ingredient.model";
import {ShoppingListService} from "../shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {
  private _recipes: Recipe[] = [
    new Recipe('Porridge',
      'Andromeda recommends😏',
      'data:image/jpeg;base64,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',
      [
        new Ingredient('apples', 5),
        new Ingredient('bananas', 4)
      ]
    ),
    new Recipe('Roast potatoes',
      'Andromeda doesn`t like it😐',
      'data:image/jpeg;base64,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',
      [
        new Ingredient('Potatoes', 5),
        new Ingredient('Onion', 1)
      ]
    )
  ];
  recipesChanged = new Subject<Recipe[]>();

  constructor(private shoppingListService: ShoppingListService) {

  }

  get recipes(): Recipe[] {
    return this._recipes.slice();
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
    this.recipesChanged.next(this.recipes);
  }

  delete(id: number): void {
    this._recipes.splice(this.findIndex(id), 1);
    this.triggerRecipesChangedEvent();
  }

  private findIndex(id: number): number {
    return this.recipes.findIndex(rec => id === rec.id);
  }
}
