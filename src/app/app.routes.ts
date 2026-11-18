import { Routes } from '@angular/router';

const MARCA = 'Arena Sur';

/** Cada pantalla se carga "perezosamente" (lazy loading): solo se descarga cuando se visita. */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'disponibilidad' },
  {
    path: 'disponibilidad',
    title: `Disponibilidad · ${MARCA}`,
    loadComponent: () => import('./features/disponibilidad/disponibilidad.page').then((m) => m.DisponibilidadPage),
  },
  {
    path: 'arrendar',
    title: `Arrendar · ${MARCA}`,
    loadComponent: () => import('./features/arrendar/arrendar.page').then((m) => m.ArrendarPage),
  },
  {
    path: 'mis-arriendos',
    title: `Mis arriendos · ${MARCA}`,
    loadComponent: () => import('./features/mis-arriendos/mis-arriendos.page').then((m) => m.MisArriendosPage),
  },
  {
    path: 'editar/:id',
    title: `Modificar arriendo · ${MARCA}`,
    loadComponent: () =>
      import('./features/mis-arriendos/editar-arriendo.page').then((m) => m.EditarArriendoPage),
  },
  {
    path: 'admin/arriendos',
    title: `Arriendos · ${MARCA}`,
    loadComponent: () => import('./features/admin/arriendos.page').then((m) => m.ArriendosAdminPage),
  },
  {
    path: 'admin/canchas',
    title: `Canchas · ${MARCA}`,
    loadComponent: () => import('./features/admin/canchas.page').then((m) => m.CanchasAdminPage),
  },
  { path: '**', redirectTo: 'disponibilidad' },
];
