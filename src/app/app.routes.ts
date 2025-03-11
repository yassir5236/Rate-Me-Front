import { Routes } from '@angular/router';

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
    data: { animation: 'RegisterPage' },
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
    data: { animation: 'LoginPage' },
  },
  {
    path: 'test',
    loadComponent: () =>
      import('./test/test/test.component').then((m) => m.TestComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
    data: { animation: 'Profile' },
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },
  {
    path: 'category',
    loadComponent: () =>
      import('./category/category.component').then((m) => m.CategoryComponent),
  },
  {
    path: 'places',
    loadComponent: () =>
      import('./place-management/place-management.component').then(
        (m) => m.PlaceManagementComponent
      ),
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
