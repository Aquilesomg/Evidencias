import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,],
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateY(0)', opacity: 1 })),
      transition(':enter', [
        style({ transform: 'translateY(100%)', opacity: 0 }),
        animate('300ms ease-out')
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notification: Notification | null = null;
  private subscription!: Subscription;
  private timer: any;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription = this.notificationService.notification$.subscribe(notification => {
      this.notification = notification;
      if (notification) {
        // El timer se reinicia con cada nueva notificación
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.close();
        }, 4000); // La notificación desaparece después de 4 segundos
      }
    });
  }

  close(): void {
    this.notificationService.clear();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    clearTimeout(this.timer);
  }
}
