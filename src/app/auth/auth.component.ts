import { Component, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { AuthMode } from './auth-mode.enum';
import { AuthResponse } from './auth-response.interface';
import { Router } from '@angular/router';
import { PlaceholderDirective } from '../shared/directives/placeholder.directive';
import { AlertComponent } from '../shared/components/alert/alert.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnDestroy {
  authMode = AuthMode.LOGIN;
  isLoading = false;
  errorMessage: string | null = null;
  @ViewChild(PlaceholderDirective) placeholder!: PlaceholderDirective;
  private closeAlertSubscription!: Subscription;

  constructor(private authService: AuthService, private router: Router) {}

  onSwitchMode(): void {
    this.authMode =
      this.authMode === AuthMode.LOGIN ? AuthMode.SIGN_UP : AuthMode.LOGIN;
  }

  onSubmit(authForm: NgForm): void {
    if (!authForm.valid) {
      return;
    }

    this.isLoading = true;
    const formValue = authForm.value;
    const authObservable = this.authService[this.authMode](
      formValue.email,
      formValue.password
    );
    this.handleResponse(authObservable);
    authForm.reset();
  }

  handleError(error: Error): void {
    // this.errorMessage = error.message;
    this.isLoading = false;
    const alertComponentRef =
      this.placeholder.viewContainerRef.createComponent(AlertComponent);
    const component = alertComponentRef.instance;
    component.message = error.message;
    this.closeAlertSubscription = component.closeEvent.subscribe(() => {
      this.closeAlertSubscription.unsubscribe();
      this.placeholder.viewContainerRef.remove();
    });
  }

  private handleResponse(
    authResponseObservable: Observable<AuthResponse>
  ): void {
    authResponseObservable.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/recipes']);
      },
      error: this.handleError.bind(this),
    });
  }

  // onHandleError() {
  //   this.errorMessage = null;
  // }

  ngOnDestroy(): void {
    this.closeAlertSubscription?.unsubscribe();
  }
}
