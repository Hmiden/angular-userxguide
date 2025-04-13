import { Component, OnInit } from '@angular/core';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-listereservations',
  templateUrl: './listereservations.component.html',
  styleUrls: ['./listereservations.component.css']
})
export class ListereservationsComponent implements OnInit {

 

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
   goToPlanning(id: number): void {
    this.router.navigate([`/guidedetails/${id}/afficherplanning`]);
  }
   loadReservationGuides(): void {
  this.isLoading = true;

  this.ReservationGuideService.getReservationGuide().subscribe(
    (data: ReservationGuide[]) => {
      this.reservationGuides = data; // Utilisez la même variable partout
      console.log('Données complètes:', this.reservationGuides);
      
      if (this.selectedGuideId) {
        this.filteredReservations = this.reservationGuides.filter(reservation => {
          const guideId = typeof reservation.guide === 'object' 
            ? reservation.guide?.id 
            : reservation.guide;
          return guideId == this.selectedGuideId;
        });
        console.log('Données filtrées:', this.filteredReservations);
      } else {
        this.filteredReservations = [...this.reservationGuides];
      }
      
      this.isLoading = false;
    },
    (error) => {
      console.error('Erreur:', error);
      this.isLoading = false;
    }
  );
}

  getGuideDisplay(user: any): string {
    if (!user) return 'No users';
    if (typeof user === 'object') return user.email;
    return user.toString();
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
          this.router.navigateByUrl('/reservationsbyguide', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/reservationsbyguide']);
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
   
 

  approveReservation(id: number) {
    this.ReservationGuideService.updateStatus(id, 'accepted').subscribe(
      () => this.loadReservationGuides(),
      (error) => console.error('Erreur:', error)
    );
  }

  rejectReservation(id: number) {
    this.ReservationGuideService.updateStatus(id, 'rejected').subscribe(
      () => this.loadReservationGuides(),
      (error) => console.error('Erreur:', error)
    );
  }

 }
   