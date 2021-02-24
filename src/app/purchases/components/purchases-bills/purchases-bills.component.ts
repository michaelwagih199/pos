import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PurchasesBills } from '../../model/purchases-bills';
import { PurchasesBillsService } from '../../service/purchases-bills.service';
import { Supplier } from 'src/app/suppliers/models/supplier';
import { SupliersService } from 'src/app/suppliers/service/supliers.service';

@Component({
  selector: 'app-purchases-bills',
  templateUrl: './purchases-bills.component.html',
  styleUrls: ['./purchases-bills.component.scss']
})
export class PurchasesBillsComponent implements OnInit {


  displayedColumns: string[] = ['id', 'billsDate', 'billCodeCode', 'total', 'paid', 'remaining', 'mySupplier', 'notes', 'actions'];
  purchasesBills!: PurchasesBills[];
  isLoading: boolean = false
  selectedSupllier: any
  supliersList!: Supplier[];


  constructor(
    private _snackBar: MatSnackBar,
    private purchasesBillsService: PurchasesBillsService,
    private supliersService: SupliersService,) { }

  ngOnInit(): void {
    this.retrieve()
    this.getAllSuppliers()
  }

  /**
   * data
   */

  retrieve() {
    this.isLoading = true;
    const params = this.getRequestParams(this.page, this.pageSize);
    this.purchasesBillsService.getAllPagination(params).subscribe(
      (data) => {
        this.isLoading = false;
        this.purchasesBills = data.purchasesBills
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  getAllSuppliers() {
    this.supliersService.findAll().subscribe(data => { this.supliersList = data }, error => console.error(error))
  }



  /**
   * evants
   */


  editeDialog(obj: any) {

  }

  deleteDialog(obj: any) {

  }

  refresh() {
    this.retrieve()
    this.getAllSuppliers()
  }

  addDialog() {

  }


  /**
  * ui ux
  */
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  page = 1;
  count = 0;
  pageSize = 6;

  handlePageChange(event: any) {
    this.page = event;
    this.retrieve();
  }


  getRequestParams(page: any, pageSize: any) {
    // tslint:disable-next-line:prefer-const
    let params: any = {};
    if (page) {
      params[`page`] = page - 1;
    }
    if (pageSize) {
      params[`size`] = pageSize;
    }
    return params;
  }



}
