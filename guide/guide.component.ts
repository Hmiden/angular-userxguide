import { Component, OnInit } from '@angular/core';
import { GuideService } from 'src/app/services/guide.service';
import { Guide } from 'src/app/models/guide.model';
import { Router, ActivatedRoute } from '@angular/router';
import { PhotosServiceService } from 'src/app/services/photos-service.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'

@Component({
  selector: 'app-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.css']
})
export class GuideComponent implements OnInit {

  ratingStars = [1, 2, 3, 4, 5];
  selectedRating: number = 0;
  imagePathPreview: string | ArrayBuffer | null = null;

getCountryCode(arg0: string) {
throw new Error('Method not implemented.');
}
   guides: Guide[] = [];
   isLoading = true;
   error: string | null = null;
 
   constructor(private guideService: GuideService, private route: ActivatedRoute, private photoServiceService: PhotosServiceService,    private sanitizer: DomSanitizer
   ) {}
 
   ngOnInit(): void {

    this.route.fragment.subscribe(fragment => {
      if (fragment) {
        const element = document.getElementById(fragment);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  
    this.loadguides();
  }

  loadguides(): void {
    this.isLoading = true;
    this.error = null;

    this.guideService.getGuide().subscribe({
      next: (guides: Guide[]) => {
        this.guides = guides;
        this.isLoading = false;
        this.guides.forEach(guide => {
          safeImageUrl: this.getSafeImageUrl(guide.photo)
         
        });
      },
      error: (err) => {
        this.error = 'Failed to load guides. Please try again later.';
        this.isLoading = false;
        console.error('Error loading guides:', err);
      }
    });
  }
  getSafeImageUrl(photo: string | undefined): SafeUrl {
    if (!photo) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        'assets/frontend/images/default-guide.jpg'
      );
    }
    

    // If it's already a full URL or base64
    if (photo.startsWith('http') || photo.startsWith('data:image')) {
      return this.sanitizer.bypassSecurityTrustResourceUrl(photo);
    }

    // Construct URL for backend images
    const fullUrl = `localhost:8089/tourisme/Guide/images/${photo}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  }

  convertphotoToBase64(guide: Guide): void {

    if (guide.photo && guide.photo.startsWith('uploads')) {
      guide.photo = `assets/frontend/images/${guide.photo}`; // Adjust path
    }
    // Check if the photo is a URL and convert it to base64
    if (typeof guide.photo === 'string' && guide.photo.startsWith('http')) {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        if (context) {
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          guide.photo = canvas.toDataURL(); // Convert imagePath to base64 string
        }
      };
      img.src = guide.photo;
    }
  }getImagePath(imageName: string | undefined | null): string {
    // Si pas de nom d'image
    if (!imageName) {
      return 'assets/frontend/images/default-guide.jpg';
    }
  
    // Si c'est déjà une URL complète ou base64
    if (imageName.startsWith('http') || imageName.startsWith('data:image')) {
      return imageName;
    }
  
    // Construction de l'URL selon votre configuration backend
    return `localhost:8089/tourisme/Guides/images/${imageName}`;
  }

  apiUrl: string = 'localhost:8089/tourisme/Guide/images';
  getImageUrl(photo: string | undefined): string {
    return `${this.apiUrl}/images/${photo}?t=${new Date().getTime()}`;
  }
  
}
