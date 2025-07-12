import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AiChatComponent } from './components/ai-chat/ai-chat.component';
import { NotificationComponent } from './components/notification/notification.component';
import { AuthService } from './auth/auth.service'; // ✅ Importa el AuthService
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    AiChatComponent,
    NotificationComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService) {} // ✅ Inyecta el servicio

  ngOnInit(): void {
    this.authService.checkAuthStatus().subscribe(); // ✅ Llama al método para restaurar sesión
  }
}
