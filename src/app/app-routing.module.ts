import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },

  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },

  {
    path: 'stock',
    loadChildren: () => import('./stock/stock.module').then(m => m.StockModule),
  },

  {
    path: 'customers',
    loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule),
  },

  {
    path: 'saleOrder',
    loadChildren: () => import('./sale-orders/sale-orders.module').then(m => m.SaleOrdersModule),
  },

  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expenses.module').then(m => m.ExpensesModule),
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
