import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MdbTablePaginationComponent ,MdbTableDirective, MDBModalService } from 'angular-bootstrap-md';
import { RestApiService } from '../rest-api.service';
import { Book } from '../models/Book';
import { EditbookComponent } from '../editbook/editbook.component';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent implements OnInit, AfterViewInit {
  @ViewChild(MdbTablePaginationComponent) mdbTablePagination: MdbTablePaginationComponent;
  @ViewChild(MdbTableDirective) mdbTable: MdbTableDirective
  bookList: Book[] = [];
  previous: Book[] = [];
  headElements = ['Name', 'Number Of Pages', 'Date Of Publication', 'Authers', 'Action'];
  
  successMessage: string;
  errorMessage: string;
  constructor(private cdRef: ChangeDetectorRef, 
    private modalService: MDBModalService, 
    private apiService: RestApiService<Book>,
    private datePipe: DatePipe) { }

  ngOnInit() {
     this.apiService.get('/books').subscribe( x => {
      this.bookList = x;
      this.initializeTable();
    });
  }
  ngAfterViewInit() {
  }
  initializeTable(){

      this.mdbTable.setDataSource(this.bookList);
      this.bookList = this.mdbTable.getDataSource();
      this.previous = this.mdbTable.getDataSource();

      this.mdbTablePagination.setMaxVisibleItemsNumberTo(5);
      this.mdbTablePagination.calculateFirstItemIndex();
      this.mdbTablePagination.calculateLastItemIndex();
      this.cdRef.detectChanges();
  }
  get(){
    
  }
  delete(id: string ): void {
    this.errorMessage = null;
    this.successMessage = null;
    if (confirm('Are you sure you want to delete the record?')) {
      this.apiService.delete<any>('/books/' + id).subscribe( x =>{        
        this.successMessage = x.message;
        this.apiService.get('/books').subscribe( x => {
          this.bookList = x;
        },err=>this.errorMessage = err);
      },err=>this.errorMessage = err);
    }
  }
  
}