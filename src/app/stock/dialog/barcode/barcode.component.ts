import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-barcode',
  templateUrl: './barcode.component.html',
  styleUrls: ['./barcode.component.scss'],
})
export class BarcodeComponent implements OnInit {
  barcode: any;
  constructor(
    private dialogRef: MatDialogRef<BarcodeComponent>,
    @Inject(MAT_DIALOG_DATA) data: any
  ) {
    console.log(data);
    this.barcode = data.productCode;
  }

  ngOnInit(): void {}

  onPrint(){
    window.print();
}
 

  close() {
    this.dialogRef.close();
  }
}
