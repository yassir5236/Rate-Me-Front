import { Routes } from '@angular/router';
import { HomeComponent } from './shared/home/home.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { TestComponent } from './test/test/test.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', pathMatch: 'full', component: HomeComponent },
    { path: 'register', pathMatch: 'full', component: RegisterComponent,  }, 
    { path: 'login', component: LoginComponent }, 
    {path:'test',component: TestComponent},
    {path :'profile',component: ProfileComponent }
  
];
