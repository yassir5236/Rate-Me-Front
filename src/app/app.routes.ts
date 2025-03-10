// import { Routes } from '@angular/router';
// import { CategoryComponent } from './category/category.component';
// import { DashboardComponent } from './dashboard/dashboard.component';
// import { LoginComponent } from './login/login.component';
// import { ProfileComponent } from './profile/profile.component';
// import { RegisterComponent } from './register/register.component';
// import { HomeComponent } from './shared/home/home.component';
// // import { TestComponent } from './test/test/test.component';
// import { PlaceManagementComponent } from './place-management/place-management.component';
// import { SelectedUserComponent } from './selected-user/selected-user.component';
// import { TestComponent } from './test/test/test.component';

// export const routes: Routes = [
//     { path: '', pathMatch: 'full', component: HomeComponent },
//     { path: 'register', pathMatch: 'full', component: RegisterComponent,  },
//     { path: 'login', component: LoginComponent },
//     {path:'test',component: TestComponent},
//     {path :'profile',component: ProfileComponent },
//     {path : 'dashboard',component: DashboardComponent},
//     {path : 'category',component: CategoryComponent},
//     {path:'places',component:PlaceManagementComponent},
//     {path:'selectedUser/:userId' ,component: SelectedUserComponent}

// ];

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./shared/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'register',
    pathMatch: 'full',
    loadComponent: () =>
      import('./register/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
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
      import('./contact/contact.component').then(
        (m) => m.ContactComponent),
  },
];
