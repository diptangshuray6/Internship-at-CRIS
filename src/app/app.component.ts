import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { HomeComponent } from "./home/home.component";
import { ServicesComponent } from './services/services.component';
import { MoreInfoComponent } from './more-info/more-info.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import{MatMenuModule} from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { RailwayService } from './railway.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet,MatToolbarModule,MatIconModule,MatMenuModule,MatButtonModule,RouterLink,CommonModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

}
