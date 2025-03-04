import { Routes } from '@angular/router';
import { CategoryComponent } from './category/category.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './shared/home/home.component';
// import { TestComponent } from './test/test/test.component';
import { PlaceManagementComponent } from './place-management/place-management.component';
import { SelectedUserComponent } from './selected-user/selected-user.component';
import { TestComponent } from './test/test/test.component';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomeComponent },
    { path: 'register', pathMatch: 'full', component: RegisterComponent,  }, 
    { path: 'login', component: LoginComponent }, 
    {path:'test',component: TestComponent},
    {path :'profile',component: ProfileComponent },
    {path : 'dashboard',component: DashboardComponent},
    {path : 'category',component: CategoryComponent},
    {path:'places',component:PlaceManagementComponent},
    {path:'selectedUser/:userId' ,component: SelectedUserComponent}
  
];
