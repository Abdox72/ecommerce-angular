import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Order, OrderItem } from '../interfaces/order';
import { CartService } from './cart.service';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { User } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  orders$ = this.ordersSubject.asObservable();

  constructor(
    private cartService: CartService,
    private firestoreService: FirestoreService,
    private authService: AuthService
  ) {
    // Load orders for current user
    this.loadUserOrders();
  }

  private async loadUserOrders(): Promise<void> {
    try {
      this.authService.getCurrentUser().subscribe(async (user) => {
        if (user) {
          const orders = await this.firestoreService.getDocumentByFieldWithLimitAndOrder(
            'orders',
            'userId',
            user.uid,
            100,
            'createdAt'
          );
          this.ordersSubject.next(orders);
        } else {
          this.ordersSubject.next([]);
        }
      });
    } catch (error) {
      console.error('Error loading orders:', error);
      this.ordersSubject.next([]);
    }
  }

  async createOrder(shippingInfo: any): Promise<Order|null> {
    try {
      let _user_!:User;
      this.authService.getCurrentUser().subscribe({
        next:async (user) =>{
              if (!user) {
                throw new Error('User not authenticated');
              }
              _user_ = user;
            },
        error:(err:Error)=>{
          throw new Error(err.message);
        }
      });
        if(_user_){
          const cartItems = this.cartService.getCartItems();
          const orderItems: OrderItem[] = cartItems.map(product => ({
            product,
            quantity: this.cartService.getProductQuantity(product.id)
          }));    
          const newOrder: Order = {
            id: '', // Will be set by Firestore
            userId: _user_?.uid,
            items: orderItems,
            total: this.cartService.getTotal(),
            status: 'pending',
            shippingInfo,
            createdAt: new Date(),
            updatedAt: new Date()
          };    
          // Add order to Firestore
          const orderId = await this.firestoreService.addData('orders', newOrder);
          if (!orderId) {
            throw new Error('Failed to create order');
          }    
          // Update the order with the Firestore ID
          newOrder.id = orderId;
          await this.firestoreService.updateDocument('orders' ,orderId,{id:orderId})
          // Update local state
          const currentOrders = this.ordersSubject.value;
          this.ordersSubject.next([...currentOrders, newOrder]);
          return newOrder;
        }
        return null;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }
  async updateOrderStatus(orderId: string, status: Order['status']): Promise<void> {
    try {
      const order = await this.firestoreService.getDocument('orders', orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      const updatedOrder = {
        ...order,
        status,
        updatedAt: new Date()
      };
      const success = await this.firestoreService.updateDocument('orders', orderId, updatedOrder);
      if (!success) {
        throw new Error('Failed to update order status');
      }

      // Update local state
      const orders = this.ordersSubject.value;
      const orderIndex = orders.findIndex(o => o.id === orderId);
      if (orderIndex !== -1) {
        orders[orderIndex] = updatedOrder;
        this.ordersSubject.next([...orders]);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  async getOrderById(orderId: string): Promise<Order | null> {
    try {
      return await this.firestoreService.getDocument('orders', orderId);
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  getOrders(): Observable<Order[]> {
    return this.orders$;
  }
} 