import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login.component/login.component';
import {AuthLayoutComponent} from './layouts/auth-layout.component/auth-layout.component';
import {MainLayoutComponent} from './layouts/main-layout.component/main-layout.component';
import {DashboardComponent} from './pages/dashboard.component/dashboard.component';
import {HomeComponent} from './pages/dashboard.component/home.component/home.component';
import {PatientsComponent} from './pages/dashboard.component/patients.component/patients.component';
import {CalendarComponent} from './pages/dashboard.component/calendar.component/calendar.component';
import {OrdersComponent} from './pages/dashboard.component/orders.component/orders.component';
import {InventoryComponent} from './pages/dashboard.component/inventory.component/inventory.component';
import {
  PatientInfoComponent
} from './pages/dashboard.component/patients.component/patient-info.component/patient-info.component';
import {
  PatientListComponent
} from './pages/dashboard.component/patients.component/patient-list.component/patient-list.component';
import {ServicesComponent} from './pages/dashboard.component/services.component/services.component';
import {IotComponent} from './pages/dashboard.component/iot.component/iot.component';
import {NotFoundComponent} from './pages/not-found.component/not-found.component';
import {UsersComponent} from './pages/dashboard.component/users.component/users.component';
import {
  ModalsServicesComponent
} from './pages/dashboard.component/services.component/modals-services.component/modals-services.component';
import {
  AddModalsServicesComponent
} from './pages/dashboard.component/services.component/modals-services.component/add-modals-services.component/add-modals-services.component';
import {
  EditModalsServicesComponent
} from './pages/dashboard.component/services.component/modals-services.component/edit-modals-services.component/edit-modals-services.component';
import {
  DeleteModalsServicesComponent
} from './pages/dashboard.component/services.component/modals-services.component/delete-modals-services.component/delete-modals-services.component';
import {
  AddUserModalComponent
} from './pages/dashboard.component/users.component/modals/add-user-modal.component/add-user-modal.component';
import {
  EditUserModalComponent
} from './pages/dashboard.component/users.component/modals/edit-user-modal.component/edit-user-modal.component';
import {
  DeleteUserModalComponent
} from './pages/dashboard.component/users.component/modals/delete-user-modal.component/delete-user-modal.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {path: '', redirectTo: 'login', pathMatch: 'full'},
      { path: 'login', component: LoginComponent },

    ]
  },
  {
    path: 'dashboard',
    component: MainLayoutComponent,
    children: [{ path: '', component: DashboardComponent,
      children: [
        {path: 'home', component: HomeComponent},
        { path: '', component: PatientsComponent,
          children: [
            {path: 'pacientes', component: PatientListComponent},
            {path: 'info-paciente', component: PatientInfoComponent}
          ]
        },
        {path: 'calendario', component: CalendarComponent},
        {path: 'ordenes', component: OrdersComponent},
        {path: 'inventario', component: InventoryComponent},
        {path: 'servicios', component: ServicesComponent},
        {path: 'iot', component: IotComponent},
        {path: 'empleados', component: UsersComponent},
      ]
    }
    ]
  },
  {
  path: '**', component: AuthLayoutComponent, children: [
      {path: '', component: DeleteUserModalComponent},
    ]
  }
];
