import { Component, OnInit, } from '@angular/core';
import { Arabic } from 'src/app/text';
import { FormControl } from '@angular/forms';
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
  searchInout: any
  productSearchValue: any
  installmentValue: any = 30
  productSelectedSearchFilter!: string;

  dynamicOrderList: DynamicOrder[] = [];

  //calc
  totalValue: number = 0;
  paid: number = 0;
  discount: number = 0;


  constructor(
    private customerService: CustomerService,
    private dynamicItemService: DynamicItemService,
    private productService: ProductServiceService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.getAllNames()
    this.getOrderCode()
    this.getProductNames()

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
    this.findByName()
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
    let orderTypeId
    let paymentTypeId
    if (this.orderType == 'جملة')
      orderTypeId = 1;
    else
      orderTypeId = 2

    if (this.paymentType == 'كاش')
      paymentTypeId = 1
    else if (this.paymentType == 'تقسيط')
      paymentTypeId = 2
    else
      paymentTypeId = 3
    this.findproductByName(paymentTypeId, orderTypeId);
  }

  findproductByName(paymentTypeId: number, orderTypeId: number) {
    this.dynamicItemService.findDynamic(this.productSearchValue, paymentTypeId, orderTypeId, this.installmentValue)
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
      })
  }


  findByName() {
    this.isLoading = true
    this.customerService.findByName(this.searchInout).subscribe(data => {
      this.isLoading = false
    }, error => console.log(error))
  }

  OnHumanSelected(SelectedHuman: any) {
    this.searchInout = SelectedHuman;
    this.findByName()
  }


  displayFn(value: any): string {
    console.log(value)
    this.searchInout = value
    return value;
  }

  onSaveOrder() {
    //saveOrder
    //todo 
    
    
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
