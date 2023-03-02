import {Component} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "./auth.service";
import {Observable} from "rxjs";
import {AuthMode} from "./auth-mode.enum";
import {AuthResponse} from "./auth-response.interface";
import {Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  authMode = AuthMode.LOGIN;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private authService: AuthService,
              private router: Router) {
  }

  onSwitchMode() {
    this.authMode = this.authMode === AuthMode.LOGIN ? AuthMode.SIGN_UP : AuthMode.LOGIN;
  }

  onSubmit(authForm: NgForm) {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    const formValue = authForm.value;
    const authObservable = this.authService[this.authMode](formValue.email, formValue.password);
    this.handleResponse(authObservable);
    authForm.reset();
  }

  private handleResponse(authResponseObservable: Observable<AuthResponse>) {
    authResponseObservable.subscribe({
      next: response => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: this.handleError.bind(this)
    });
  }

  handleError(error: Error) {
    this.errorMessage = error.message;
    this.isLoading = false;
  }
}
