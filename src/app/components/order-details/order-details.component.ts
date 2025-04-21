import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../interfaces/order';
import { ToastrService } from 'ngx-toastr';
import { FirestoreDatePipe } from '../../pipes/firestore-date.pipe';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink , FirestoreDatePipe],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  order: Order | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadOrderDetails();
  }

  async loadOrderDetails(): Promise<void> {
    this.loading = true;
    this.error = null;
    const orderId = this.route.snapshot.paramMap.get('id');
    
    if (!orderId) {
      this.error = 'Order ID not provided';
      this.loading = false;
      return;
    }

    try {
      const order = await this.ordersService.getOrderById(orderId);
      if (order) {
        this.order = order;
      } else {
        this.error = 'Order not found';
      }
    } catch (error) {
      console.error('Error loading order:', error);
      this.error = 'Failed to load order details';
    } finally {
      this.loading = false;
    }
  }

  getStatusClass(status: string): string {
    console.log(status)
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'processing':
        return 'status-processing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-default';
    }
  }
} 