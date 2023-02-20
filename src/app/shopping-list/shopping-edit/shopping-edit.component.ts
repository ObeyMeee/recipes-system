import {Component, ElementRef, ViewChild} from '@angular/core';
import {ShoppingListService} from "../shopping-list.service";
import {Ingredient} from "../../shared/Inghredient.model";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @ViewChild('nameInput') nameInputRef!: ElementRef;
  @ViewChild('amountInput') amountInputRef!: ElementRef;

  constructor(private shoppingListService: ShoppingListService) {

  }

  addIngredient() {
    const name = this.getNativeElement(this.nameInputRef).value;
    const amount = +this.getNativeElement(this.amountInputRef).value;
    const newIngredient = new Ingredient(name, amount);
    this.shoppingListService.addIngredients(newIngredient);
  }

  private getNativeElement(elRef: ElementRef) {
    return elRef.nativeElement;
  }
}
