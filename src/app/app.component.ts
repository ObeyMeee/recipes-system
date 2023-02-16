import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'shopping';
  feature = 'recipe';

  onNavigate(selectedFeature: string) {
    this.feature = selectedFeature;
  }
}
