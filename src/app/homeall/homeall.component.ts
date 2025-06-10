import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { Router } from '@angular/router';
import { RailwayService } from '../railway.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgIf, NgFor],
  templateUrl: './homeall.component.html',
  styleUrl: './homeall.component.css'
})
export class HomeallComponent {
  dataList: any[] = [];
  routeList: any[] = [];
  selectedCategory: string = '';
  showPassenger: boolean = false;
  showoperational: boolean = false;
  data: any = {};  // fetching data from json file
  selectedInfo: any = null;  //using selected info

  private router = inject(Router);
  private railwayservice = inject(RailwayService);

  ngOnInit() {
    this.loadJsonData();
  }

  loadJsonData() {
    this.railwayservice.getRailwayData().subscribe((data: any) => {
      try{
        console.log(data);
        const jsonData = data;
           this.dataList = jsonData.Departments || [];
      }catch(e){
        console.error("JSON Parse Error:", e, "Response Text:", data);
      }
    });
  }

  fetchData(category: string) {
    this.selectedCategory = category;
    if (category === 'Passenger') {
      this.showPassenger = !this.showPassenger;
      this.showoperational = false;
      this.routeList = Array.isArray(this.data[category]) ? this.data[category] : [];
      //this.routeList = this.passengers;
    } else if (category === 'Operational') {
      this.showoperational = !this.showoperational;
      this.showPassenger = false;
      this.routeList = Array.isArray(this.data[category]) ? this.data[category] : [];
      //this.routeList = this.operationalList;
    }
  }

  navigateToDetails(Id: any) {
    this.router.navigate(['/details/', +Id]);
  }
}
