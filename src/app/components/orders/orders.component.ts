import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { Order } from '../../interfaces/order';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FirestoreDatePipe } from '../../pipes/firestore-date.pipe';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, RouterLink , FirestoreDatePipe]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  currentOrders: Order[] = [];
  pastOrders: Order[] = [];
  loading = true;
  error: string | null = null;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.loadOrders();
    console.log(this.orders)
  }

  loadOrders(): void {
    this.loading = true;
    this.error = null;
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.currentOrders = orders.filter(order => 
          order.status === 'pending' || order.status === 'processing' || order.status === 'shipped'
        );
        this.pastOrders = orders.filter(order => 
          order.status === 'delivered' || order.status === 'cancelled'
        );
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load orders. Please try again later.';
        this.loading = false;
        console.error('Error loading orders:', err);
      }
    });
  }

  getStatusClass(status: string): string {
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
  ifEmpty():string{
    return (this.orders.length)? '' : 'vh-100' ;
  }
} 