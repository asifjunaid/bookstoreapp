import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RestApiService } from '../rest-api.service';
import { Book } from '../models/Book';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editbook',
  templateUrl: './editbook.component.html',
  styleUrls: ['./editbook.component.css']
})
export class EditbookComponent implements OnInit {  
  isEdit:Boolean = false
  submitted: Boolean = false;
  bookForm: FormGroup;
  recordId: string;
  successMessage: string;
  errorMessage: string;
  actionTitle:string='Add New Book';
  constructor(private formBuilder: FormBuilder, private activatedRoute: ActivatedRoute,
              private apiService: RestApiService<Book>, 
              private datePipe: DatePipe) {

     }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      name: ['', Validators.required],
      numberOfPages: ['', [Validators.required]],
      dateOfPublication: ['', Validators.required],
      authers: ['', Validators.required]
  });
    this.activatedRoute.params.subscribe(params => {
      this.recordId = params.id;      
      if(this.recordId!==undefined && this.recordId!==''){
      this.isEdit  = true;
      this.actionTitle  = 'Edit Book';
      this.apiService.getById('/books/' + this.recordId ).subscribe(x => {
       let date = new Date(x.dateOfPublication * 1000);
       this.bookForm.setValue({
          name: x.name,
          numberOfPages: x.numberOfPages,
          dateOfPublication: {
            year: date.getFullYear() ,
            month: date.getMonth()+1 ,
            day: date.getDay()
          },
          authers: x.authers
        });
      });
    }else{
      this.recordId = '';
      this.isEdit = false;
    }
    });
  }
  // convenience getter for easy access to form fields
  get f() { return this.bookForm.controls; }

  onSubmit() {
    this.errorMessage = null;
    this.successMessage =null;
    this.submitted = true;
    if (!this.bookForm.invalid) {
      const formData = new FormData();
      formData.append('name', this.f.name.value);      
      formData.append('numberOfPages', this.f.numberOfPages.value );
      let d = this.f.dateOfPublication.value ;      
      formData.append('dateOfPublication', (new Date(d.year,d.month-1,d.day).getTime()/1000).toString() );
      formData.append('authers', this.f.authers.value );
      if(this.isEdit==true){
        this.apiService.update<any>('/books/'+ this.recordId,formData)
        .subscribe(x =>this.successMessage = x.message
          ,err=>this.errorMessage = err);  
      }
      else{
        this.apiService.save<any>('/books/',formData)
        .subscribe(x => this.successMessage = x.message
          ,err=>this.errorMessage = err);  
      }
    }
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}