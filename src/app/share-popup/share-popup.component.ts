import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-share-popup',
  imports: [CommonModule,FormsModule],
  templateUrl: './share-popup.component.html',
  styleUrl: './share-popup.component.css'
})

export class SharePopupComponent {
  @Output() share = new EventEmitter<string>(); // Emit the title when sharing
  @Output() cancel = new EventEmitter<void>(); // Emit when canceling

  title: string = ''; // Title input

  // Handle the share action
  onShare(): void {
    this.share.emit(this.title);
  }

  // Handle the cancel action
  onCancel(): void {
    this.cancel.emit();
  }
}