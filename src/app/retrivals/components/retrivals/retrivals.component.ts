import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { RetrivalsModel } from '../../models/retrivals-model';
import { RetrivalsService } from '../../service/retrivals.service';
import { RerivalDetailsComponent } from '../../dialgos/rerival-details/rerival-details.component';
import { CreateRetrivalsComponent } from '../../dialgos/create-retrivals/create-retrivals.component';

@Component({
  selector: 'app-retrivals',
  templateUrl: './retrivals.component.html',
  styleUrls: ['./retrivals.component.scss'],
})
export class RetrivalsComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'retrievalsCode',
    'totalCost',
    'discount',
    'netCost',
    'customer',
    'createdDate',
    'actions',
  ];

  retrivalsList!: RetrivalsModel[];
  retriveModel: RetrivalsModel = new RetrivalsModel();
  isLoading = false;

  constructor(
    private _snackBar: MatSnackBar,
    private retrivalService: RetrivalsService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.retrieve();
  }

  /**
   * data
   */

  retrieve() {
    this.isLoading = true;
    const params = this.getRequestParams(this.page, this.pageSize);
    this.retrivalService.getAllPagination(params).subscribe(
      (data) => {
        this.isLoading = false;
        this.retrivalsList = data.retrievalsBills;
        this.count = data.totalItems;
      },
      (error) => {
        this.isLoading = false;
        console.log(error);
      }
    );
  }

  /**
   * evants
   */
  editeDialog(obj: any) {

  }

  deleteDialog(obj: any) {}

  Ondetails(obj: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = {
      id: obj.id,
    };
    this.dialog.open(RerivalDetailsComponent, dialogConfig);
    const dialogRef = this.dialog.open(
      RerivalDetailsComponent,
      dialogConfig
    );
  }

  refresh() {
    this.retrieve();
  }

  addDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      retriveModel: this.retriveModel,
    }

    this.dialog.open(CreateRetrivalsComponent, dialogConfig);
    const dialogRef = this.dialog.open(CreateRetrivalsComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((data) => {
      console.log(data)
     
    });
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
