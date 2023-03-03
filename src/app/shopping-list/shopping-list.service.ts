import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/Ingredient.model';
import { Subject } from 'rxjs';

@Injectable()
export class ShoppingListService {
  clickIngredientSubject = new Subject<number>();
  ingredientsChanged = new Subject<Ingredient[]>();

  private _ingredients: Ingredient[] = [
    new Ingredient('apples', 5),
    new Ingredient('bananas', 4),
  ];

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

  deleteIngredient(index: number) {
    this._ingredients.splice(index, 1);
    this.triggerUpdateEvent();
  }

  private triggerUpdateEvent() {
    this.ingredientsChanged.next(this.ingredients);
  }
}
