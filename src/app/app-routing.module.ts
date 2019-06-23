import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { HomeComponent } from './home/home.component';
import { EditbookComponent } from './editbook/editbook.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'books', component: BooksComponent },
  { path: 'editbook/:id', component: EditbookComponent },
  { path: 'addbook/:id', component: EditbookComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
