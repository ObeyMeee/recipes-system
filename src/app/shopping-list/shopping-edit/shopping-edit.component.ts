import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ShoppingListService} from "../shopping-list.service";
import {Ingredient} from "../../shared/Ingredient.model";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {FormMode} from "./form-mode";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('ingredientsForm') ingredientsForm!: NgForm;
  formMode = FormMode.ADD;
  editIngredientSubscription!: Subscription;
  private selectedIngredientIndex!: number;

  constructor(private shoppingListService: ShoppingListService) {

  }

  ngOnInit(): void {
    this.editIngredientSubscription = this.shoppingListService.clickIngredientSubject.subscribe(index => {
      const ingredient = this.shoppingListService.ingredients[index];
      this.ingredientsForm.setValue({
        name: ingredient.name,
        amount: ingredient.amount
      });
      this.formMode = FormMode.EDIT;
      this.selectedIngredientIndex = index;
    })
  }

  onSubmit() {
    const formValue = this.ingredientsForm.value;
    const newIngredient = new Ingredient(formValue.name, formValue.amount);
    if (this.formMode === FormMode.ADD) {
      this.shoppingListService.addIngredients(newIngredient);
    } else {
      this.shoppingListService.editIngredient(this.selectedIngredientIndex, newIngredient);
    }
    this.onClear();
  }

  ngOnDestroy(): void {
    this.editIngredientSubscription.unsubscribe();
  }

  onDelete() {
    this.shoppingListService.deleteIngredient(this.selectedIngredientIndex);
    this.onClear();
  }

  onClear() {
    this.ingredientsForm.reset();
    this.formMode = FormMode.ADD;
  }
}
