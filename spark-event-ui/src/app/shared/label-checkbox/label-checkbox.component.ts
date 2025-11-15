import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-label-checkbox',
  standalone: true,
  template: `
    <label>
      <input type="checkbox" [checked]="checked" (change)="onInputChange($event)" />
      {{ label }}
    </label>
  `,
})
export class LabelCheckboxComponent {
  @Input() checked: boolean = false;
  @Input() label: string = '';

  // prend en charge [(checked)]
  @Output() checkedChange = new EventEmitter<boolean>();

  // événement utilitaire pour la parent qui veut simplement réagir au changement
  @Output() change = new EventEmitter<void>();

  onInputChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.checkedChange.emit(this.checked);
    this.change.emit();
  }
}

