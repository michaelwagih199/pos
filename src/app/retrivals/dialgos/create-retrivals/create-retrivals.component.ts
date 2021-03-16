import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpensessModel } from 'src/app/expenses/models/expensess-model';
import { ExpensesCategoryService } from 'src/app/expenses/service/expenses-category.service';
import { SaleOrderDetails } from 'src/app/sale-orders/models/orderDetails';
import { OrderPaymentModel } from 'src/app/sale-orders/models/orderPayment';
import { SaleOrderModel } from 'src/app/sale-orders/models/saleOrder';
import { OrderDetailsService } from 'src/app/sale-orders/service/order-details.service';
import { OrderPaymentService } from 'src/app/sale-orders/service/order-payment.service';
import { OrderService } from 'src/app/sale-orders/service/order.service';
import { CreateProductComponent } from 'src/app/stock/dialog/create-product/create-product.component';
import { RetrivalsModel } from '../../models/retrivals-model';
import { RetrivalsService } from '../../service/retrivals.service';

@Component({
  selector: 'app-create-retrivals',
  templateUrl: './create-retrivals.component.html',
  styleUrls: ['./create-retrivals.component.scss'],
})
export class CreateRetrivalsComponent implements OnInit {
  validateForm!: FormGroup;
  retriveModel: RetrivalsModel = new RetrivalsModel();
  codeSearch: any;
  billsCode: any;
  productName: any;
  saleOrderList: SaleOrderDetails[] | undefined;
  retrivalBillsList: RetrivalsModel[] | undefined;
  saleOrderPaymentList: OrderPaymentModel[] | undefined;

  constructor(
    private fb: FormBuilder,
    private retrivalService: RetrivalsService,
    private orderPaymentService: OrderPaymentService,
    private modalService: NgbModal,
    private saleOrderDetails: OrderDetailsService,
    private dialogRef: MatDialogRef<CreateRetrivalsComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {}

  ngOnInit(): void {
    this.getNextCode();
  }

  /**
   * data
   */
  getNextCode() {
    this.retrivalService.getBillsCode().subscribe((data) => {
      this.billsCode = data;
    });
  }

  /**
   * events
   */

  save() {
    let data = {
      model: this.retriveModel,
      billsCode: this.billsCode,
      productName: this.productName,
    };
    this.dialogRef.close(data);
  }

  closeResult = '';

  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  onRetrive(obj: SaleOrderDetails) {
    console.log(obj);
  }

  getBills() {
    this.saleOrderDetails.getByCode(this.codeSearch).subscribe((data) => {
      this.saleOrderList = data;
    });
    this.orderPaymentService.getByCode(this.codeSearch).subscribe((data) => {
      this.saleOrderPaymentList = data;
    });
  }

  close() {
    this.dialogRef.close();
  }
}
