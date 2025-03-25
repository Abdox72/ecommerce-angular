import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit {
  date:string = '2025';
  constructor() {
  }
  ngOnInit() {
    this.date = new Date().getFullYear().toString();
  }
}
