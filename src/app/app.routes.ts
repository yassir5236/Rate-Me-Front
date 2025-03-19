import { Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AuthGuard } from './guards/auth.guard';
import { OutGuard } from './guards/out.guard';
import { PlaceResolver } from './resolvers/place.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./shared/home/home.component').then((m) => m.HomeComponent),
    data: { animation: 'HomePage' },
  },
  {
    path: 'register',
    pathMatch: 'full',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
    canActivate: [OutGuard],
    data: { animation: 'RegisterPage' },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    canActivate: [OutGuard],
    data: { animation: 'LoginPage' },
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [AuthGuard],
    data: { animation: 'Profile' },
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./category/category.component').then((m) => m.CategoryComponent),
    canActivate: [AdminGuard],
    data: { animation: 'category' },
  },
  {
    path: 'places',
    loadComponent: () =>
      import('./place-management/place-management.component').then(
        (m) => m.PlaceManagementComponent
      ),
    resolve: { places: PlaceResolver },
    data: { animation: 'places' },
  },
  {
    path: 'selectedUser/:userId',
    loadComponent: () =>
      import('./selected-user/selected-user.component').then(
        (m) => m.SelectedUserComponent
      ),
  },
  {
    path: 'contact',
    loadComponent: () =>
      import('./contact/contact.component').then((m) => m.ContactComponent),
    data: { animation: 'contact' },
  },
];
