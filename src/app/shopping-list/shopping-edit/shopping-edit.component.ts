import {Component, ElementRef, EventEmitter, Output, ViewChild} from '@angular/core';
import {Ingredient} from "../../shared/Inghredient.model";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent {
  @ViewChild('nameInput') nameInputRef!: ElementRef;
  @ViewChild('amountInput') amountInputRef!: ElementRef;
  @Output() addIngredientEvent = new EventEmitter<Ingredient>();

  addIngredient() {
    const name = this.nameInputRef.nativeElement.value;
    const amount = +this.amountInputRef.nativeElement.value;
    const newIngredient = new Ingredient(name, amount)
    this.addIngredientEvent.emit(newIngredient);
  }
}
