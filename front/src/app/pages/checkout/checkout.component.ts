import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { loadStripe, Stripe, StripeElements, StripePaymentElement } from '@stripe/stripe-js';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CartService } from '../../services/cart.service';
@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('paymentElement') paymentElementRef!: ElementRef;

  stripe: Stripe | null = null;
  elements: StripeElements | undefined;
  paymentElement: StripePaymentElement | undefined;
  
  isLoading = true;
  isProcessing = false;
  errorMessage: string | null = null;

  constructor(
    private http: HttpClient, 
    private router: Router,
    private cartService: CartService, // Inyectamos el servicio
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    try {
      this.stripe = await loadStripe(environment.stripePublicKey);
      
      this.http.post<{clientSecret: string}>(`${environment.apiUrl}/api/payments/create-intent`, {})
        .subscribe({
          next: (res) => {
            if (!res.clientSecret) {
              this.handleError("No se pudo obtener la autorización de pago.");
              return;
            }
            this.elements = this.stripe?.elements({ clientSecret: res.clientSecret });
            this.paymentElement = this.elements?.create('payment');
            this.paymentElement?.mount(this.paymentElementRef.nativeElement);
            this.isLoading = false;
            this.cd.detectChanges();
          },
          error: () => this.handleError("No se pudo iniciar el proceso de pago. ¿Tu carrito está vacío?")
        });
    } catch (error) {
      this.handleError("No se pudo cargar la pasarela de pagos.");
    }
  }

  async handleSubmit(event: Event) {
    event.preventDefault();
    if (this.isProcessing || !this.stripe || !this.elements) {
      return;
    }

    this.isProcessing = true;
    this.errorMessage = null;

    const { error, paymentIntent } = await this.stripe.confirmPayment({
      elements: this.elements,
      redirect: 'if_required'
    });

    if (error) {
      this.errorMessage = error.message || 'Ocurrió un error inesperado durante el pago.';
      this.isProcessing = false;
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      const orderPayload = {
        shippingAddress: 'Dirección de prueba, Calle 123',
        paymentIntentId: paymentIntent.id
      };
      this.http.post(`${environment.apiUrl}/api/pedidos`, orderPayload)
        .subscribe({
          next: () => {
            this.cartService.loadCart();
            this.router.navigate(['/pedido-exitoso']); 
          },
          error: () => {
            this.errorMessage = "El pago fue exitoso, pero hubo un error al crear tu pedido. Por favor, contacta a soporte.";
            this.isProcessing = false;
          }
        });
    } else {
      this.errorMessage = "El pago no se completó. Por favor, intenta de nuevo.";
      this.isProcessing = false;
    }
  }

  private handleError(message: string) {
    this.errorMessage = message;
    this.isLoading = false;
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    this.paymentElement?.destroy();
  }
}