import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Customer } from '../../../model/Customer/customer';
import { TranslateProvider } from '../../../providers';
import { TokenStorage } from './../../../token.storage';

@Component({
  selector: 'app-add-customer-component',
  templateUrl: './add-customer-component.component.html',
  styleUrls: ['./add-customer-component.component.scss'],
})
export class AddCustomerComponentComponent implements OnInit {

  @Output() customerDetail = new EventEmitter<string>();


  customer: Customer;
  isView: boolean = false;
  loader: boolean = false;

  onCustomerForm: FormGroup;

  firstName: FormControl = new FormControl();
  lastName: FormControl = new FormControl();
  email: FormControl = new FormControl();
  Phone: FormControl = new FormControl();
  gender: FormControl = new FormControl();
  language: FormControl = new FormControl();
  noOfKids: FormControl = new FormControl();
  noOfPets: FormControl = new FormControl();
  company: FormControl = new FormControl();
  birthday: FormControl = new FormControl();
  anniversaryDate: FormControl = new FormControl();

  constructor(private formBuilder: FormBuilder,
    //private customerService : CustomerService,
    private token: TokenStorage,
    private translate: TranslateProvider) {
    this.customer = new Customer();

    this.onCustomerForm = this.formBuilder.group({
      'firstName': ['', Validators.compose([
        Validators.required
      ])],
      'lastName': ['', Validators.compose([
        Validators.required
      ])],
      'email': ['', Validators.compose([
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        Validators.required,
        Validators.email
      ])],
      'Phone': ['', Validators.compose([
        Validators.required
      ])],
      'gender': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'language': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'noOfKids': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'noOfPets': ['', Validators.compose([
        Validators.nullValidator
      ])],
      'company': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'birthday': ['', Validators.compose([
        Validators.nullValidator,
      ])],
      'anniversaryDate': ['', Validators.compose([
        Validators.nullValidator,
      ])]
    });

  }

  ngOnInit() { }

  addCustomer() {
    this.customerDetail.emit("string customer");
  }

  onSubmit() {
    this.customer.propertyId = parseInt(this.token.getPropertyId());
    // if (this.customer.anniversaryDate != null)
    // {
    //   this.customer.anniversaryDate = this.convertCalenderDateToJavaSQLDate(new Date(this.customer.anniversaryDate));
    // }
    // if (this.customer.birthday != null)
    // {
    //   this.customer.birthday = this.convertCalenderDateToJavaSQLDate(new Date(this.customer.birthday));
    // }

    // Logger.log('customer '+ JSON.stringify(this.customer));
    // this.loader = true;
    // this.customerService.createCustomer(this.customer).subscribe(res => {
    //      this.loader = false;
    //      this.customer = res.body;

    // },error=>{
    //   this.loader = false;
    // });
  }

  cancel() { }

}
