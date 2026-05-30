import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  standalone: true,
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.scss'
})
export class FileUploadComponent {
  @Input() label = 'Upload file';
  @Input() accept = 'image/*,.pdf';
  @Input() hint = 'PNG, JPG or PDF up to 2 MB';
  @Input() previewUrl: string | null = null;
  @Output() fileSelected = new EventEmitter<{ name: string; dataUrl: string }>();

  protected readonly error = signal('');

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      this.error.set('File must be under 2 MB.');
      return;
    }
    this.error.set('');
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = String(reader.result);
      this.fileSelected.emit({ name: file.name, dataUrl: this.previewUrl });
    };
    reader.readAsDataURL(file);
  }
}
