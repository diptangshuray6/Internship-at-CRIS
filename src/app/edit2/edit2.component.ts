import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Router } from 'express';
import { ActivatedRoute } from '@angular/router';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RailwayService } from '../railway.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit2',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './edit2.component.html',
  styleUrl: './edit2.component.css'
})
export class Edit2Component {


  constructor(){}

    // data={
    //   id: 0,
    //   name: '',
    //   Introduction: '',
    //   Scope_Of_Work: '',
    //   Future_Enhancements: ''  // Add other properties based on JSON file structure
    // };


  // ngOnInit(): void {
  //   this.Id = this.params.snapshot.paramMap.get('id');
  //   //this.getById();
  // }

  // getById() {
  //   this.RailwayService.getRailwayData().subscribe((data:any)=>{
  //     this.details = data.OperationalList;
  //     this.data = this.details[this.Id-1];
  //   });
  // }
}
