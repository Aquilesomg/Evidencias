import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../auth/auth.service';

@Component({
  selector: 'app-profile-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile-info.component.html',
  styleUrls: ['./profile-info.component.css']
})
export class ProfileInfoComponent implements OnInit {
  profileForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.profileForm.patchValue(user);
      }
    });
  }

  onSubmit() {
    // Lógica para llamar al servicio y actualizar el perfil
    console.log('Guardando cambios:', this.profileForm.value);
  }
}
