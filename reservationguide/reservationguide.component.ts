import { Component, OnInit } from '@angular/core';
import { ReservationGuideService } from 'src/app/services/reservationguide.service';
import { UserService } from 'src/app/services/user.service';
import { ReservationGuide } from 'src/app/models/reservationguide.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { Guide } from 'src/app/models/guide.model';
import { GuideService } from 'src/app/services/guide.service';

@Component({
  selector: 'app-ReservationGuide',
  templateUrl: './ReservationGuide.component.html',
  styleUrls: ['./ReservationGuide.component.css']
})
export class ReservationGuideComponent implements OnInit {
  selectedGuideId: number | null = null;
  ReservationReservationGuideForm!: FormGroup;
  users: any[] = [];
  allUsers: any[] = [];
  guideDetails: any = null;

  constructor(
    private ReservationGuideService: ReservationGuideService,
    private userService: UserService,
    private guideService: GuideService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute // Injection de ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.loadUsers();
    this.getGuideFromRoute();
  }

  initForm() {
    this.ReservationReservationGuideForm = this.fb.group({
      duration: ['', Validators.required],
      status: ['pending', Validators.required],
      userId: ['', Validators.required],
      guideId: ['', Validators.required],
      price: [0, Validators.required],
      comment: ['', [Validators.required]],
      dateHour: ['', Validators.required],
    });
  }

  getGuideFromRoute() {
    this.route.queryParams.subscribe(params => {
      this.selectedGuideId = params['guideId'] ? +params['guideId'] : null;
      
      if (this.selectedGuideId) {
        console.log('Guide sélectionné:', this.selectedGuideId);
        this.loadGuideDetails(this.selectedGuideId);
        this.ReservationReservationGuideForm.patchValue({
          guideId: this.selectedGuideId
        });
      }
    });
  }

  loadGuideDetails(guideId: number) {
    this.guideService.getGuideById(guideId).subscribe(
      (guide: any) => {
        this.guideDetails = guide;
        console.log('Détails du guide:', this.guideDetails);
      },
      error => {
        console.error('Erreur lors du chargement du guide', error);
      }
    );
  }

  loadUsers() {
    this.userService.getUsers().subscribe(
      (users: any[]) => {
        this.allUsers = users;
        this.users = users.map(user => ({
          id: user.id,
          email: user.email
        }));
      },
      error => {
        console.error('Error loading users', error);
      }
    );
  }

  onSubmit() {
    if (this.ReservationReservationGuideForm.valid) {
      const formValue = this.ReservationReservationGuideForm.value;
      
      const payload = {
        duration: formValue.duration,
        status: formValue.status,
        price: formValue.price,
        comment: formValue.comment,
        dateHour: new Date(formValue.dateHour),
        user: { id: formValue.userId } as User,
        guide: { id: formValue.guideId } as Guide,
      } as ReservationGuide;
      
      this.ReservationGuideService.addReservationGuide(payload).subscribe(
        response => {
          console.log('Reservation created successfully', response);
          this.router.navigate(['/listereservationsguide']);
        },
        error => {
          console.error('Error creating reservation', error);
          // Gestion d'erreur plus user-friendly ici
        }
      );
    }
  }

  navigateToList() {
    this.router.navigate(['/listereservationsguide']);
  }
}
