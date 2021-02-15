export class Arabic {
    util = {
        searchfilter: "بحث عن طريق",
        byName: "الاسم",
        byCode: "الكود",
        saved: "تم الحفظ",
        date:"التاريخ",
        tables: {
            id: 'م',
            name: 'الاسم',
            phone: 'موبايل',
            notes: 'ملاحظات',
        },
        dialogButtons: {
            ok: "نعم",
            cancel: "إلغاء",
        },
    }
    
    navBarList = {
        seling: "بيع",
        customers: "العملاء",
        supplers: "الموردين",
        retrival: "المرتجع",
        stock: "المخزن",
        expenses: "المصروفات",
        reports: "التقارير",
        setting: "الاعدادات",
        aboutApp: "عن التطبيق",
    }

    stock = {
        tabs: {
            tab1: "التصنيفات",
            tab2: "المنتجات"
        },
        category: {
            util: {
                searchBar: "البحث فى التصنيفات",
                dialog: {
                    addDialog: {
                        title: "حفظ التصنيف",
                        buttons: {
                            save: "حفظ",
                            cancel: "إلغاء",
                        }
                    },
                    deleteDialog: {
                        title: "هل تريد المسح"
                    },
                    dialogButtons: {
                        ok: "نعم",
                        cancel: "إلغاء",
                    },
                    notification: {
                        deleted: "تم المسح",
                        saved: "تم الحفظ"
                    }
                }
            },
            table: {
                name: "اﻷسم"
            }
        },
        products: {
            table: {
                productName: "الاسم",
                retailPrice: "سعر التجزئة",
                purchasingPrice: "سعر الشراء",
                numberUnitsInStock: "عدد القطع",
                alertUnits: "الحد الادنى",
                productCategory: "التصنيف",
                wholesalePrice: "سعر الجملة",
                productCode: "كود الصنف",
                title: "اضافة الصنف"
            },
            util: {
                automaticCode: "ليس له كود",
                searchBar: "البحث فى المنتجات",

            }
        }

    }
    
    customers = {
       util:{
           searchBar:"بحث فى العملاء",
           paymentValue:"قيمة الدفعة",
           paymentDate:"تاريخ الدفعه",
           addPayment:"اضافة الدفعة",
           allPayment:"اجمالى المدفوعات",
           remaining:"المتبقى"

       }
    }

    saleOrder={
        util:{
            orderType:"نوع الطلب",
            paymentType:"طريقة الدفع",
            orderCode:"رقم الفاتورة",
            orderTypeSelection:{
                wholesale:"جملة",
                retailseal:"تجزئه"
            },
            paymentTypeSelection:{
                cash:"كاش",
                installment:"تقسيط",
                oncredit:"آجل",
                installmentValue:"نسبه التقسيط %"
            }

        },
        table:{

        }

    }
}