import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Coronavirus } from "./coronavirus";
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CoronavirusService {
  private subject = new Subject<boolean>();
  public isLoginData = false;

  // http://localhost:3000/case/GetAll
  private baseUrl = 'http://localhost:3000/case/';
  // private baseUrl = 'https://localhost:44352/api/case';
  private loginUrl = 'http://localhost:3000/users/'
  // private loginUrl = 'https://localhost:44352/api/Authentication';
  private searchUrl = 'https://localhost:44352/api/SearchCaseInfos';
  private socket;

  // constructor(private http: HttpClient) { }

  constructor(private http: HttpClient) {
   // this.socket = io(this.baseUrl);
    
  }

  // setupSocketConnection() {
  //   this.socket = io("http://localhost:3000");
  //   this.socket.emit('my message', 'Hello there from Angular.');
  //   this.socket.on('my broadcast', (data: string) => {
  //     console.log(data);
  //   });
  // }

  addToCart(data: boolean) {
    this.subject.next(data);
  }

  getCart(): Observable<any> {
    return this.subject.asObservable();
  }

  isNullorUndfined(value: any) {
    return value === undefined || value === null;
  }


  getToken() {
    return this.http.get(this.loginUrl);
  }

  login(userData) {
    return this.http.post(this.loginUrl + "login", userData);
  }

  // getChatUserList() {
  //   debugger;
  //   return this.http.get(this.loginUrl + "GetAll");
  // }

  getChatUserList(id: number): Observable<any> {

    return this.http.get(`${this.loginUrl + "GetAll"}/${id}`);
  }

  searchData(data) {
    return this.http.post(this.loginUrl + "Search", data);
  }

  sendMessage(data) {
    return this.http.post(this.loginUrl + "SendMessage", data);
  }


}
