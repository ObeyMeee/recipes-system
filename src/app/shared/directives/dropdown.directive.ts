import { Directive, HostListener, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  isOpened = false;
  @Input('appDropdown') dropdown!: HTMLElement;

  constructor(private renderer: Renderer2) {}

  @HostListener('click') toggleOpen() {
    this.isOpened = !this.isOpened;
    const display = this.isOpened ? 'unset' : 'none';
    this.renderer.setStyle(this.dropdown, 'display', display);
  }
}
