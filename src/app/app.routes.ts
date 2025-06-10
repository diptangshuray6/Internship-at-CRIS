import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ServicesComponent } from './services/services.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeallComponent } from './homeall/homeall.component';
import { ComponentsComponent } from './components/components.component';
import { MoreInfoComponent } from './more-info/more-info.component';
import { FilteredDataComponent } from './filtered-data/filtered-data.component';
import { DetailsComponent } from './details/details.component';
import { Details2Component } from './details2/details2.component';
import { EditComponent } from './edit/edit.component';
import { Edit2Component } from './edit2/edit2.component';

export const routes: Routes = [
  {path:'homeall',component:HomeallComponent},
  {path:'contactus',component:ContactUsComponent},
  {path:'services',component:ServicesComponent},
  {path:'sign-up',component:SignUpComponent},
  {path:'components',component:ComponentsComponent},
  {path:'moreInfo',component:MoreInfoComponent},
  { path: 'filterData', component: FilteredDataComponent },
  { path: 'details/:id', component: DetailsComponent},
  { path: 'details2/:id', component:Details2Component},
  {path:'edit',component:EditComponent},
  {path:'edit2', component:Edit2Component},
  { path: '', component: HomeallComponent },
  {path:'**', redirectTo:'homeall' ,pathMatch:'full'},
  // //{path:'**',redirectTo:'homeall',pathMatch:'full'},
];
