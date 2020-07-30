import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class CoronavirusService {
  private subject = new Subject<boolean>();
  public isLoginData = false;

  private baseUrl = 'http://chat-bot-api.live1.dev.radixweb.net/users/'
  private socket;

  constructor(private http: HttpClient) {

  }

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
    return this.http.get(this.baseUrl);
  }

  login(userData) {
    return this.http.post(this.baseUrl + "login", userData);
  }

  // getChatUserList() {
  //   debugger;
  //   return this.http.get(this.baseUrl + "GetAll");
  // }

  getChatUserList(id: number): Observable<any> {

    return this.http.get(`${this.baseUrl + "GetAll"}/${id}`);
  }

  searchData(data) {
    return this.http.post(this.baseUrl + "Search", data);
  }

  sendMessage(data) {
    return this.http.post(this.baseUrl + "SendMessage", data);
  }

  updateMessageRead(data) {
    return this.http.post(this.baseUrl + "ReadMessage", data);
  }


}
