import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import { AppComponent } from "../app.component";
import { RouterLink, RouterOutlet } from '@angular/router';




@Component({
  selector: 'app-home',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule,RouterOutlet,RouterLink
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {



}
