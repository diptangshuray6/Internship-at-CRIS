import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { RailwayService } from '../railway.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-edit',
  imports: [RouterLink,FormsModule,CommonModule],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.css'
})
export class EditComponent implements OnInit {


  // public editData = '<p>Type Here....</p>'

  //Ckeditor Config


  constructor(
   private RailwayService: RailwayService,
   private router:Router,
   private route: ActivatedRoute
  ){}
  private params = inject(ActivatedRoute);
  private http = inject(HttpClient);

  id: any;
  details: any;
  data: any = {
    id: 0,
    name: '',
    Introduction: '',
    Scope_Of_Work: '',
    Future_Enhancements: '',
  };

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getById();
  }

  getById() {
    this.RailwayService.getRailwayData().subscribe((response: any) => {
      this.details = response.Passenger;
      this.data = this.details.find((item: any) => item.id === this.id);
    });
  }


}
