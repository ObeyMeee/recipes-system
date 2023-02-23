import {Injectable} from '@angular/core';
import {Ingredient} from "../shared/Inghredient.model";
import {Subject} from "rxjs";

@Injectable()
export class ShoppingListService {
  private _ingredients: Ingredient[] = [
    new Ingredient('apples', 5),
    new Ingredient('bananas', 4)
  ];
  ingredientsChanged = new Subject<Ingredient[]>();

  get ingredients() {
    return this._ingredients.slice();
  }

  addIngredients(...ingredients: Ingredient[]) {
    this._ingredients.push(...ingredients);
    this.ingredientsChanged.next(this.ingredients);
  }
}
