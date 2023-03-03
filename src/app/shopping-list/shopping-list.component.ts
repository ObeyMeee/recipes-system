import { Component, OnDestroy, OnInit } from '@angular/core';
import { Ingredient } from '../shared/Ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients!: Ingredient[];
  subscription!: Subscription;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.ingredients = this.shoppingListService.ingredients;
    this.subscription = this.shoppingListService.ingredientsChanged.subscribe(
      (ingredients) => (this.ingredients = ingredients)
    );
  }

  onEdit(index: number) {
    this.shoppingListService.clickIngredientSubject.next(index);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
