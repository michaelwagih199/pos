import { Supplier } from 'src/app/suppliers/models/supplier'

export class PurchasesBills {
    id: number | undefined
    billCodeCode: string | undefined
    billsDate: any
    notes: string | undefined
    total: number | undefined
    paid: number | undefined
    remaining: number | undefined
    mySupplier: Supplier | undefined
    createdDate: string | undefined
}
