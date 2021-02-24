import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupliersService } from '../../service/supliers.service';
import { Subscription } from 'rxjs';
import { Supplier } from '../../models/supplier';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Arabic } from 'src/app/text';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SupplierPayment } from '../../models/supplier-payment';
import { SupliersPaymentService } from '../../service/supliers-payment.service';

@Component({
  selector: 'app-supliers-payment',
  templateUrl: './supliers-payment.component.html',
  styleUrls: ['./supliers-payment.component.scss']
})
export class SupliersPaymentComponent implements OnInit {

  private routeSub!: Subscription;

  validateForm!: FormGroup;
  arabic: Arabic = new Arabic()
  supplierPayment: SupplierPayment = new SupplierPayment()
  supplier: Supplier = new Supplier()
  supplierId!: number
  isLoading: boolean = false
  allPayment: any = 0.0
  indebtedness: any = 0.0

  supplierPaymentList!: SupplierPayment[]
  //for tables
  displayedColumns: string[] = ['id', 'paymentDate', 'paymentValue', 'notes', 'actions']

  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private supliersService: SupliersService,
    private supplierPaymentService: SupliersPaymentService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getSupplierId()
    this.findById()
    this.validateform()
    this.retrivePayment()
  }


  /**
   * data
   */

  retrivePayment() {
    this.isLoading = true
    const params = this.getRequestParams(this.page, this.pageSize);
    this.supplierPaymentService.findById(params, this.supplierId)
      .subscribe(
        data => {
          this.isLoading = false
          this.supplierPaymentList = data.supplierPayment;
          this.count = data.totalItems;
          this.getAllPayment()
        },
        error => {
          this.isLoading = false
          console.log(error);
        });
  }

  getAllPayment() {
    this.supplierPaymentService.getAllPayment(this.supplierId).subscribe(data => {
      this.allPayment = data
    }, error => console.log(error))
  }

  getSupplierId() {
    this.routeSub = this.route.params.subscribe(params => {
      this.supplierId = params['id']
    });
  }

  findById() {
    this.supliersService.findById(this.supplierId).subscribe(data => {
      this.supplier = data
    }, error => console.log(error))
  }



  /**
   * events
   */

  addPayment() {
    this.isLoading = true
    this.supplierPaymentService.createPayment(this.supplierPayment, this.supplierId)
      .subscribe(data => {
        this.isLoading = false
        this.openSnackBar(`${this.arabic.util.saved}`, '')
        this.retrivePayment()
        this.supplierPayment = new SupplierPayment()
      }, error => console.log(error))
  }

  editePayment(obj: any) {

  }

  deletePayment(obj: any) {

  }


  back() {
    this.router.navigate([`suppliers`])
  }


  /**
   * uiux 
   */
  validateform() {
    this.validateForm = this.fb.group({
      paymentValue: [null, [Validators.required]],
      paymentDate: [null, [Validators.required]],
      notes: [null,],
    });
  }

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
    this.retrivePayment();
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
