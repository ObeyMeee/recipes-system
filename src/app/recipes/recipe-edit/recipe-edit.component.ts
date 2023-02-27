import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {Recipe} from "../recipe.model";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id!: number;
  editMode = false;
  recipeForm!: FormGroup;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private recipeService: RecipeService) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.editMode = Number.isFinite(this.id);
    });
    this.initForm();
  }

  private initForm() {
    const recipe = this.recipeService.getById(this.id);
    this.recipeForm = new FormGroup({
      name: new FormControl(recipe?.name ?? '', {validators: Validators.required}),
      imagePath: new FormControl(recipe?.imagePath ?? '', {validators: Validators.required}),
      description: new FormControl(recipe?.description ?? '', {validators: Validators.required}),
      ingredients: this.initFormArrayIngredients(recipe)
    });
  }

  private initFormArrayIngredients(recipe: Recipe): FormArray<FormGroup> {
    const recipeIngredients = new FormArray<FormGroup>([])
    recipe?.ingredients.forEach(ingredient =>
      recipeIngredients.push(new FormGroup({
        name: new FormControl(ingredient.name, {validators: Validators.required}),
        amount: new FormControl(ingredient.amount, {validators: [Validators.required, Validators.min(1)]})
      }))
    );
    return recipeIngredients;
  }

  onSubmit(): void {
    const formValue = this.recipeForm.value;
    const recipe = new Recipe(
      formValue['name'],
      formValue['description'],
      formValue['imagePath'],
      formValue['ingredients']
    );
    if (Number.isFinite(this.id)) {
      recipe.id = this.id;
    }
    this.recipeService.save(recipe);
    this.navigateBack();
  }

  get controls() {
    return this.ingredientsFormArray.controls
  }

  get ingredientsFormArray(): FormArray {
    return <FormArray>this.recipeForm.get('ingredients');
  }

  onAddIngredientControl(): void {
    this.ingredientsFormArray.push(new FormGroup({
      name: new FormControl(null, {validators: Validators.required}),
      amount: new FormControl(null, {validators: [Validators.required, Validators.min(1)]}),
    }));
  }

  onDeleteIngredientControl(index: number) {
    this.ingredientsFormArray.removeAt(index);
  }

  navigateBack(): void {
    this.router.navigate(['../'], {relativeTo: this.route});
  }
}
