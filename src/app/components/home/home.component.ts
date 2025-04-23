import { Component } from '@angular/core';
import { SlidershowComponent } from '../slidershow/slidershow.component';
import { SubscribeSectionComponent } from "../subscribe-section/subscribe-section.component";
import { BestsellersComponent } from "../bestsellers/bestsellers.component";

@Component({
  selector: 'app-home',
  imports: [SlidershowComponent, SubscribeSectionComponent, BestsellersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(){}
}
