import {Injectable} from '@angular/core';
import {Ingredient} from "../shared/Ingredient.model";
import {Subject} from "rxjs";

@Injectable()
export class ShoppingListService {
  clickIngredientSubject = new Subject<number>();
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
    this.triggerUpdateEvent();
  }

  editIngredient(index: number, ingredient: Ingredient) {
    this._ingredients[index] = ingredient;
    this.triggerUpdateEvent();
  }

  private triggerUpdateEvent() {
    this.ingredientsChanged.next(this.ingredients);
  }

  deleteIngredient(index: number) {
    this._ingredients.splice(index, 1);
    this.triggerUpdateEvent();
  }
}
