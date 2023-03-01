import {Ingredient} from "../shared/Ingredient.model";

export class Recipe {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  ingredients: Ingredient[];

  constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[]) {
    this.id =Math.random();
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
