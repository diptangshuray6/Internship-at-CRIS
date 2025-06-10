import {RailwayService} from '../railway.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-filtered-data',
  imports: [CommonModule],
  templateUrl: './filtered-data.component.html',
  styleUrl: './filtered-data.component.css'
})
export class FilteredDataComponent {

  data: any;

  constructor(private Router:Router) {
    this.data = this.Router.getCurrentNavigation()?.extras.state?.['data'];
  }

}

