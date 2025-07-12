import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileInfoComponent } from './components/profile-info/profile-info.component';
import { ProfileAddressesComponent } from './components/profile-addresses/profile-addresses.component';
import { ProfileOrdersComponent } from './components/profile-orders/profile-orders.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ProfileInfoComponent, ProfileAddressesComponent, ProfileOrdersComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  activeTab: 'perfil' | 'direcciones' | 'pedidos' = 'perfil';

  switchTab(tab: 'perfil' | 'direcciones' | 'pedidos') {
    this.activeTab = tab;
  }
}