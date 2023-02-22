import {Ingredient} from "../shared/Inghredient.model";

export class Recipe {
  private static count = 0;
  id: number;
  name: string;
  description: string;
  imagePath: string;
  ingredients: Ingredient[];

  constructor(name: string, description: string, imagePath: string, ingredients: Ingredient[]) {
    this.id = Recipe.count++;
    this.name = name;
    this.description = description;
    this.imagePath = imagePath;
    this.ingredients = ingredients;
  }
}
