import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private http = inject(HttpClient);

  // These should ideally be in environment files
  private cloudName = 'dwz8hazeu'; // Placeholder, replace with actual
  private uploadPreset = 'Veterinary-mobile'; // Placeholder, replace with actual
  private apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`;

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.uploadPreset);

    return this.http.post<any>(this.apiUrl, formData).pipe(
      map(response => response.secure_url)
    );
  }
}
