import { Component, OnInit } from '@angular/core';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { Router, ActivatedRoute } from '@angular/router'; // Pour naviguer
@Component({
  selector: 'app-list-greservation',
  templateUrl: './list-greservation.component.html',
  styleUrls: ['./list-greservation.component.css']
})
export class ListGReservationComponent implements OnInit {

  reservationGuides: ReservationGuide[] = [];
  filteredReservations: ReservationGuide[] = [];
  selectedGuideId: number | null = null;
  isLoading: boolean = true;
downloadContract() {
} 
 
   ReservationGuides: ReservationGuide[] = [];
 
   constructor(private ReservationGuideService: ReservationGuideService, private router: Router, private activatedRoute: ActivatedRoute) {}
   reserver(ReservationGuide: ReservationGuide) {
 
     }
   ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe(params => {
      this.selectedGuideId = params['guideId'] ? +params['guideId'] : null;
      this.loadReservationGuides();
    });


     this.ReservationGuideService.getReservationGuide().subscribe(
       (data: ReservationGuide[]) => {
         this.ReservationGuides = data;
       },
       (error) => {
         console.error('Erreur lors de la récupération des ReservationGuides:', error);
       }
     );
   }

   loadReservationGuides(): void {
    this.isLoading = true;

    this.ReservationGuideService.getReservationGuide().subscribe(
      (data: ReservationGuide[]) => {
        this.ReservationGuides = data;
        
        // Filtrer les réservations si un guideId est spécifié
        if (this.selectedGuideId) {
          this.filteredReservations = this.reservationGuides.filter(
            reservation => typeof reservation.guide === 'object' && reservation.guide?.id === this.selectedGuideId
          );
        } else {
          this.filteredReservations = [...this.reservationGuides];
        }
        
        this.isLoading = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des réservations:', error);
        this.isLoading = false;
      }
    );
  }

  getGuideDisplay(guide: any): string {
    if (!guide) return 'No guide';
    if (typeof guide === 'object') return guide.name;
    return guide.toString();
  }
  getGuideemail(guide: any): string {
    if (!guide) return 'No guide';
    if (typeof guide === 'object') return guide.contact;
    return guide.toString();
  }

 editReservationGuide(guideReservationId: number ): void {
    if (guideReservationId !== undefined) {
      // Proceed with using the guideId here, e.g., navigate to edit page
      console.log(`Editing guide with ID: ${guideReservationId}`);
    } else {
      console.error("GuideReservation ID is undefined");
    }
  }
  deleteReservationGuide(guideReservationId: number) {
    if (confirm('Are you sure you want to delete this guide?')) {
      this.ReservationGuideService.deleteReservationGuide(guideReservationId).subscribe(
        () => {
          // Remove the guide from the list (optimistic UI update)
          this.ReservationGuides = this.ReservationGuides.filter(guide => guide.idReservation !== guideReservationId);
          
          // Navigate to the same route to refresh the page and show the updated list
          this.router.navigateByUrl('/listereservationsguide', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/listereservationsguide']);
          });
        },
        error => {
          // You can handle any errors here
        }
      );
    }
  }
  navigateToGuide(): void {  
    this.router.navigate(['/guide']);
  }
   
 }
   
 