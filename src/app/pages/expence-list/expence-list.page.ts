import { Logger } from "../../service/logger.service";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras } from "@angular/router";
import { ActionSheetController, NavController } from "@ionic/angular";
import { Expense } from "../../model/Expense/Expense";
import { DateService } from "../../service/DateService/date-service.service";
import { ExpenseService } from "../../service/ExpenseService/expense-service.service";
import { TokenStorage } from "./../../token.storage";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Property } from "src/app/model/property/Property";

@Component({
    selector: "app-expence-list",
    templateUrl: "./expence-list.page.html",
    styleUrls: ["./expence-list.page.scss"],
})
export class ExpenceListPage implements OnInit {
    expenses: Expense[] = [];
    expensesSearchObject: Expense[] = [];
    property: Property;

    isView: boolean = false;
    permission: string;
    p: number = 1;

    onFindExpenseForm: FormGroup;

    expenseSearchSelection: string = "findExpese";

    fromDateString: string;
    toDateString: string;

    toMinDate: string;
    toMaxDate: string;
    currentDay: string;
    currentMonth: string;

    loader: boolean = false;
           isFromModalOpen = false;
             isToModalOpen = false;

    constructor(
        private navCtrl: NavController,
        private expenseService: ExpenseService,
        private changeDetectorRefs: ChangeDetectorRef,
        private dateService: DateService,
        private formBuilder: FormBuilder,
        private acRoute: ActivatedRoute,
        private route: ActivatedRoute,
        private actionSheetController: ActionSheetController,
        public token: TokenStorage
    ) {
        this.onFindExpenseForm = this.formBuilder.group({
            bookingFromDate: ["", Validators.compose([Validators.required])],
            bookingToDate: ["", Validators.compose([Validators.required])],
        });
        this.property = new Property();
    }

    ngOnInit() {
        this.currentExpense()
        this.expenseChanged();
        this.property = this.token.getProperty();
            console.log("property details", this.property)
    }

    navigateToPage() {
        this.navCtrl.navigateForward('/home');
      }
    ionViewWillEnter() {
        Logger.log("ng view enter Payment list");
        this.expenseChanged();
    }

 

    setFromDateOpen(isOpen: boolean) {
    this.isFromModalOpen = isOpen;
  }

  dismissFromDateModal() {
    this.isFromModalOpen = false;
  }

      setToDateOpen(isOpen: boolean) {
    this.isToModalOpen = isOpen;
  }

      dismissToDateModal() {
    this.isToModalOpen = false;
    }
    
    fromDateChange() {
        let toDate = new Date(this.fromDateString);

        toDate.setDate(toDate.getDate() + 1);
        this.toMinDate = this.getDate(toDate);

        toDate.setDate(toDate.getDate() + 30);
        this.toMaxDate = this.getDate(toDate);
    }

    getDate(date: Date) {
        if (date.getDate().toString().length == 1) {
            this.currentDay = "0" + date.getDate();
        } else {
            this.currentDay = "" + date.getDate();
        }

        if ((date.getMonth() + 1).toString().length == 1) {
            this.currentMonth = "0" + (date.getMonth() + 1);
        } else {
            this.currentMonth = "" + (date.getMonth() + 1);
        }

        return (
            date.getFullYear() + "-" + this.currentMonth + "-" + this.currentDay
        );
    }

    ResetAllField() {
        this.onFindExpenseForm.reset();
        this.expenses = [];
        this.expensesSearchObject = [];
    }

    createExpence() {
        this.navCtrl.navigateForward("manage-expence");
    }

    onExpenceDetail(expense) {
        let navigationExtras: NavigationExtras = {
            queryParams: {
                expenseOb: JSON.stringify(expense),
                permission: 1,
            },
        };

        this.navCtrl.navigateForward(["manage-expence"], navigationExtras);
    }

    expenseList() {
      this.loader = true;
        this.expenses = [];
        this.expensesSearchObject = [];
        this.expenseService
            .findAllExpensesByPropertyId(this.token.getPropertyId())
            .subscribe((resp1) => {
                this.expenses = resp1;
                this.expensesSearchObject = resp1;
                this.loader=false
                Logger.log("Exp : " + JSON.stringify(resp1));
                this.expenses.reverse();
            });
    }

    expenseChanged() {
        if (this.expenseSearchSelection === "findExpese") {
            this.expenses = [];
            this.expensesSearchObject = [];
            this.currentExpense();
        } else if (this.expenseSearchSelection === "allExpense") {
            this.findExpense();
        }
    }

    currentExpense() {
        let date: Date = new Date();
    let todate: Date = new Date();

    todate.setDate(todate.getDate() + 1);

    this.fromDateString = this.getDate(date);
    this.toDateString = this.getDate(todate);

            this.loader = true;
            this.expenseService
                .findByPropertyIdAndDateRange(
                    this.token.getPropertyId(),
                    this.fromDateString,
                    this.toDateString
                )
                .subscribe(
                    (res) => {
                        this.expenses = res;
                        this.expensesSearchObject = res;
                        this.loader = false;
                        this.expenses.reverse();
                        this.changeDetectorRefs.detectChanges();
                    },
                    (error) => {
                        this.loader = false;
                        this.changeDetectorRefs.detectChanges();
                    }
                );
        }

    findExpense() {
        if (
            this.fromDateString != null &&
            this.fromDateString != undefined &&
            this.toDateString != null &&
            this.toDateString != undefined
        ) {
            this.fromDateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.fromDateString
                );
            this.toDateString =
                this.dateService.convertMillisecondsToYYYMMDDFormat(
                    this.toDateString
                );

            this.loader = true;
            this.expenseService
                .findByPropertyIdAndDateRange(
                    this.token.getPropertyId(),
                    this.fromDateString,
                    this.toDateString
                )
                .subscribe(
                    (res) => {
                        this.expenses = res;
                        this.expensesSearchObject = res;
                        this.loader = false;
                        this.expenses.reverse();
                        this.changeDetectorRefs.detectChanges();
                    },
                    (error) => {
                        this.loader = false;
                        this.changeDetectorRefs.detectChanges();
                    }
                );
        }
    }

    async onExpenceOption(expense) {
        const actionSheet = await this.actionSheetController.create({
            header: "Expense option",
            buttons: [
                {
                    text: "View",
                    icon: "eye",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                expenseOb: JSON.stringify(expense),
                                permission: 1,
                            },
                        };

                        this.navCtrl.navigateForward(
                            ["manage-expence"],
                            navigationExtras
                        );

                        Logger.log("Cancel clicked");
                    },
                },
                {
                    text: "Edit",
                    icon: "create",
                    handler: () => {
                        let navigationExtras: NavigationExtras = {
                            queryParams: {
                                expenseOb: JSON.stringify(expense),
                                permission: 2,
                            },
                        };

                        this.navCtrl.navigateForward(
                            ["manage-expence"],
                            navigationExtras
                        );

                        Logger.log("Cancel clicked");
                    },
                },
                {
                    text: "Close",
                    icon: "close",
                    role: "cancel",
                    handler: () => {
                        Logger.log("Cancel clicked");
                    },
                },
            ],
        });
        await actionSheet.present();
    }

    clearSearch(event: any) {
        Logger.log("clearSearch -- ");
    }

    getItems(ev: any) {
        const val = ev.target.value;

        Logger.log("search -- " + val);

        if (val === "") {
            this.expenseChanged();
        } else {
            this.expenses = this.expensesSearchObject;

            this.expenses = this.expenses.filter((item) => {
                const searchResult =
                    (item.name != null &&
                        item.name
                            .toLowerCase()
                            .trim()
                            .indexOf(val.trim().toLowerCase().trim()) > -1) ||
                    String(item.id).indexOf(val.trim()) > -1 ||
                    (item.date != null &&
                        this.dateService
                            .convertMillisecondsToDateFormat(item.date)
                            .indexOf(val.trim()) > -1);

                return searchResult;
            });
        }
    }

    clear(event) {}
}
