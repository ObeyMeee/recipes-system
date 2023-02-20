import {EventEmitter, Injectable} from '@angular/core';
import {Ingredient} from "../shared/Inghredient.model";

@Injectable()
export class ShoppingListService {
  private _ingredients: Ingredient[] = [
    new Ingredient('apples', 5),
    new Ingredient('bananas', 4)
  ];
  ingredientsChanged = new EventEmitter<Ingredient[]>();

  get ingredients() {
    return this._ingredients.slice();
  }

  addIngredients(...ingredients: Ingredient[]) {
    this._ingredients.push(...ingredients);
    this.ingredientsChanged.emit(this.ingredients);
  }
}
