import { Component, OnInit, } from '@angular/core';
import { Arabic } from 'src/app/text';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CustomerService } from 'src/app/customers/service/customer.service';
import { startWith, map } from 'rxjs/operators';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateCustomerComponent } from 'src/app/customers/dialogs/create-customer/create-customer.component';
import { CustomerModel } from 'src/app/customers/model/customer-model';
import { DynamicOrder } from '../../models/dynamicOrder';
import { DynamicItemService } from '../../service/dynamic-item.service';
import { OrderService } from '../../service/order.service';
import { ProductServiceService } from 'src/app/stock/service/product-service.service';
import { OrderDetailsService } from '../../service/order-details.service';
import { CheckitesResponse } from '../../models/checkitems';
import { OrderDetailsPayload } from '../../models/orderPayload';
import { ConfirmationDialog } from 'src/app/shared/components/layout/dialog/confirmation/confirmation.component';
import { OrderPaymentService } from '../../service/order-payment.service';
import { OrderPaymentModel } from '../../models/orderPayment';


@Component({
  selector: 'app-sale-order',
  templateUrl: './sale-order.component.html',
  styleUrls: ['./sale-order.component.scss']
})
export class SaleOrderComponent implements OnInit {

  arabic: Arabic = new Arabic;
  currentDate = new Date();
  paymentType!: string;
  orderType!: string;
  orderCode: any;
  myControl = new FormControl();
  productControl = new FormControl();
  customer: CustomerModel = new CustomerModel()
  //for autocomplete
  options!: string[]
  filteredOptions!: Observable<string[]>

  productOptions!: string[]
  productFilteredOptions!: Observable<string[]>

  isLoading: boolean = false
  isInstallment: boolean = false
  searchCustomerInout = ""
  productSearchValue: any
  installmentValue: any = 30
  productSelectedSearchFilter!: string;

  dynamicOrderList: DynamicOrder[] = [];

  //calc
  totalValue: number = 0;
  paid: number = 0;
  discount: number = 0;

  orderTypeId!: number
  paymentTypeId!: number

  //validate
  canOrder: any
  canSelect = false
  checkResponse: CheckitesResponse | undefined
  orderPayload: OrderDetailsPayload = new OrderDetailsPayload()

  producForm!: FormGroup;

  orderPayment: OrderPaymentModel = new OrderPaymentModel()



  constructor(
    private customerService: CustomerService,
    private dynamicItemService: DynamicItemService,
    private orderDetailsService: OrderDetailsService,
    private orderPaymentService: OrderPaymentService,
    private productService: ProductServiceService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.getAllNames()
    this.getOrderCode()
    this.getProductNames()
    this.validateform()
  }

  /**
   * data
   */

  getAllNames() {
    this.customerService.getNames().subscribe(response => {
      this.options = response
      this.filteredOptions = this.myControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filter(value))
        );
    }, error => {
      console.log(error)
    })
  }

  getOrderCode() {
    this.isLoading = true;
    this.orderService.getOrderCode().subscribe(data => {
      this.isLoading = false
      this.orderCode = data
    }, error => {
      this.isLoading = false
      console.log(error)
    })
  }


  getProductNames() {
    this.productService.getNames().subscribe(response => {
      this.productOptions = response
      this.productFilteredOptions = this.productControl.valueChanges
        .pipe(
          startWith(''),
          map(value => this._filterproduct(value))
        );
    }, error => {
      console.log(error)
    })
  }

  /**
   * event
  */

  search() {
    this.findCustomerByName()
  }

  onSearchFilterChange(value: string) {
    if (value == 'name') {
      this.getProductNames()
      this.productSearchValue = ''
    } else {
      this.productSearchValue = ''
      this.productOptions = []
    }
    console.log(value)
  }

  productSearch() {
    if (this.paymentType && this.orderCode) {
      this.findDynamicPyCode();
      if (this.orderType == 'جملة')
        this.orderTypeId = 1;
      else
        this.orderTypeId = 2

      if (this.paymentType == 'كاش')
        this.paymentTypeId = 1
      else if (this.paymentType == 'تقسيط')
        this.paymentTypeId = 2
      else
        this.paymentTypeId = 3
    } else {
      this.openSnackBar('اختر نوع الطلب وطريقة الدفع', '')
    }

  }

  checkProduct() {
    this.orderPayload.dynamicDetailsDaoList = this.dynamicOrderList
    this.orderDetailsService.checkIfItemNotEnough(this.orderPayload).subscribe(data => {
      if (data.products) {
        this.openSnackBar('البضاعة لا تكفى', '')
        this.canOrder = true
        // this.openSnackBar(`${data.products}`, '')
      } else {
        //chaeck alert
        this.orderDetailsService.checkIfAlertItem(this.orderPayload).subscribe(data => {
          if (data.products) {

            this.openConfimation(`البضاعة ستقل للحد الادنى : ${data.products}`, () => this.findDynamicPyCode())
          }
        })
      }
    })
  }

  findDynamicPyCode() {
    this.dynamicItemService.findDynamic(this.productSearchValue,
      this.paymentTypeId,
      this.orderTypeId,
      this.installmentValue)
      .subscribe(data => {
        let item = this.dynamicOrderList.find(order => order.productName === data.productName)
        console.log(data)
        if (this.dynamicOrderList.length === 0) {
          this.dynamicOrderList.push(data)
        } else {
          if (item) {
            item.quantity += 1
            item.total = item.quantity * item.price
          } else {
            this.dynamicOrderList.push(data)
          }
        }
        this.calcTotal()
        this.checkProduct()
      })
  }




  findCustomerByName() {
    //check items 
    this.isLoading = true
    this.customerService.findByName(this.searchCustomerInout).subscribe(data => {
      this.isLoading = false
    }, error => console.log(error))
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchCustomerInout = SelectedHuman;
    this.findCustomerByName()
  }


  displayFn(value: any): string {
    console.log(value)
    this.searchCustomerInout = value
    return value;
  }

  onSaveOrder() {
    //saveOrder
    this.orderPayment.discount = this.discount
    this.orderPayment.netCost = this.totalValue - (this.discount + this.paid)
    this.orderPayment.paid = this.paid
    this.orderPayment.remaining = this.totalValue - this.paid
    this.orderService.createOrder(this.searchCustomerInout, this.orderTypeId, this.paymentTypeId).subscribe(data => {
      this.orderDetailsService.createOrderDetails(this.orderCode, this.orderPayload).subscribe()
      this.orderPaymentService.createOrderPayment(this.orderCode, this.orderPayment).subscribe()
      this.openSnackBar('تم حفظ الطلب', '')
      this.reset()
    }, error => console.log(error))

  }

  reset() {
    this.totalValue = 0;
    this.paid = 0;
    this.discount = 0;
    this.dynamicOrderList = []
    this.orderType = ''
    this.paymentType = ''
    this.productSearchValue = ''
    this.getOrderCode()
  }

  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      model: this.customer,
    }
    this.dialog.open(CreateCustomerComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateCustomerComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(
      data => {
        console.log(data)
        this.customerService.create(data.customerModel).subscribe(data => {
          this.openSnackBar(`${this.arabic.util.saved}`, '')
          this.getAllNames()
        }, error => console.log(data))
      }
    );
  }

  onPaymentTypeChange(value: string) {
    if (value == 'تقسيط') {
      this.isInstallment = true
    } else {
      this.isInstallment = false
    }
  }


  deleteDynamicItem(obj: any) {
    for (var i = 0; i < this.dynamicOrderList.length; i++) {
      if (this.dynamicOrderList[i] === obj) {
        this.dynamicOrderList.splice(i, 1);
      }
    }
    this.calcTotal()
  }

  /**
   * uiux
   */

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private _filterproduct(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.productOptions.filter(productOption => productOption.toLowerCase().includes(filterValue));
  }


  openConfimation(title: any, confirmedFn: () => void) {
    const dialogRef = this.dialog.open(ConfirmationDialog, {
      data: {
        message: title,
        buttonText: {
          ok: `${this.arabic.util.dialogButtons.ok}`,
          cancel: `${this.arabic.util.dialogButtons.cancel}`
        }
      }
    });
    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        confirmedFn()
        const a = document.createElement('a');
        a.click();
        a.remove();
      }
    });
  }

  greeter(fn: (a: string) => void) {
    fn("Hello, World");
  }
  /**
   * validate
   */

  validateform() {
    this.producForm = this.fb.group({
      productValueControl: new FormControl({ value: '', disabled: this.canOrder }),
      productFilter: [null, [Validators.required]],
    });
  }

  /**
   * accounting
   */

  calcTotal() {
    this.paid = 0;
    this.discount = 0;

    if (this.dynamicOrderList.length == 0) {
      this.totalValue = 0

    } else {

      this.totalValue = this.dynamicOrderList.map(a => a.total).reduce(function (a, b) {
        return a + b;
      })
    }
  }


}
