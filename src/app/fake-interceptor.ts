import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';

@Injectable()
export class FakeInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        try{
           // localStorage.removeItem('books');
        }catch(e){}
        let books: any[] = [];
        if(localStorage.getItem('books')==null||localStorage.getItem('books')==undefined){
            for(let i=1;i < 14; i++)
            books.push({id:i+'', 
                        name:'Book '+i, 
                        dateOfPublication:(new Date(2019,1,i).getTime()/1000).toString() ,
                        numberOfPages:100*i,
                        authers:['Tom','Jerry']});
                localStorage.setItem('books', JSON.stringify(books));

        }
        books = JSON.parse(localStorage.getItem('books'));

        // wrap in delayed observable to simulate server api call
        return of(null).pipe(mergeMap(() => {
            
            // get all books
            if (request.url.endsWith('/books') && request.method === 'GET') {
                    return of(new HttpResponse({ status: 200, body: books }));                
            }

            // get book by id
            if (request.url.match(/\/books\/\d+$/) && request.method === 'GET') {
                    // find book by id in books array
                    let urlParts = request.url.split('/');
                    let id = urlParts[urlParts.length - 1];
                    let index:number;
                    for (let i = 0; i < books.length; i++) {
                        let book = books[i];
                        if (book.id === id) {
                            index = i;
                            break;
                        }
                    }


                return of(new HttpResponse({ status: 200, body: books[index] }));
            }

            // delete book
            if (request.url.match(/\/books\/\d+$/) && request.method === 'DELETE') {
                
                    // find book by id in books array
                    let urlParts = request.url.split('/');
                    let id = urlParts[urlParts.length - 1];
                    console.log(id)
                    for (let i = 0; i < books.length; i++) {
                        let book = books[i];
                        if (book.id === id) {
                            
                            books.splice(i, 1);
                            localStorage.setItem('books', JSON.stringify(books));
                            break;
                        }
                    }

                    // respond 200 OK
                    return of(new HttpResponse({ status: 200 , statusText : 'OK', body:{ message : "Record deleted successfully!" } }));
            }
            if (request.url.match(/\/books\/\d+$/) && request.method === 'PATCH') {                
                // find book by id in books array
                let urlParts = request.url.split('/');
                let id = urlParts[urlParts.length - 1];
                let index:number;
                for (let i = 0; i < books.length; i++) {
                    let book = books[i];
                    if (book.id === id) {
                        index=i;
                        break;
                    }
                }
                let newBook = books[index];
                newBook.id = id;
                newBook.name = request.body.get('name');
                newBook.dateOfPublication =  request.body.get('dateOfPublication');
                newBook.numberOfPages =  request.body.get('numberOfPages');
                newBook.authers =  request.body.get('authers');                               
                books[index]= newBook;
                localStorage.setItem('books', JSON.stringify(books));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 , statusText : 'OK', body: {message : 'Record updated successfully!'} }));            
            }
            if (request.url.endsWith('/books/') && request.method === 'POST') {                
                // find book by id in books array          
                let idd:number = 1;
                if(books.length>0){
                    idd = (parseInt(books[books.length-1].id)+1) ;
                }
                let newBook = {
                    id: idd +'', 
                    name:request.body.get('name'), 
                    dateOfPublication:request.body.get('dateOfPublication'),
                    numberOfPages:request.body.get('numberOfPages'),
                    authers:request.body.get('authers')
                };
                books.push(newBook);
                localStorage.setItem('books', JSON.stringify(books));

                // respond 200 OK
                return of(new HttpResponse({ status: 200 , statusText : 'OK', body:{ message : 'Record added successfully!'} }));            
            }

            // pass through any requests not handled above
            return next.handle(request);
        }))

        // call materialize and dematerialize to ensure delay even if an error is thrown
        // (https://github.com/Reactive-Extensions/RxJS/issues/648)
        .pipe(materialize())
        .pipe(delay(500))
        .pipe(dematerialize());
    }    
}

export let FakeHttpClientProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: FakeInterceptor,
    multi: true
};
