import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from "rxjs";
import { CoronavirusService } from "../coronavirus.service";
import { Coronavirus, User, Message } from "../coronavirus";
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { Location } from '@angular/common';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import * as io from 'socket.io-client';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-case-list',
  templateUrl: './case-list.component.html',
  styleUrls: ['./case-list.component.scss']
})
export class CaseListComponent implements OnInit {
  userId: number = null;
  selectedUserId: number = null;
  selectedUserName: string = '';
  loginUserName: string = '';
  chatListUsers: any;
  messageForm: FormGroup;
  messages: any;
  searchData = { "fromUserId": 0, "toUserId": 0 };
  selectedIndex: number = 0;
  socket;
  @ViewChild('messageThread') messageContainer: ElementRef;
  ImageBaseData: string | ArrayBuffer = null;
  FileType: string;
  FileName: string;


  constructor(private coronavirusService: CoronavirusService,
    private router: Router, private toastr: ToastrService, private location: Location, private http: HttpClient) {
    this.socket = io("http://localhost:3000");
    this.socket.on('my broadcast', (data: string) => {

      this.getMessages(this.selectedUserId);

    });

  }

  ngOnInit(): void {
    this.scrollMessageContainer();
    this.messageForm = new FormGroup({
      message: new FormControl('', [Validators.required])
    });
    this.userId = Number(localStorage.getItem('userId'));
    this.loginUserName = localStorage.getItem('userName');
    // console.log("loginUserID:", this.userId);
    this.getUserList();


  }
  ngAfterViewChecked() {
    this.scrollMessageContainer();
  }



  getUserList() {
    this.coronavirusService.getChatUserList(this.userId)
      .subscribe(
        data => {
          this.chatListUsers = data;
          this.selectedUserName = this.chatListUsers[0].userName;
          this.selectedUserId = this.chatListUsers[0].userId;
          this.getMessages(this.chatListUsers[0].userId);
        });


  }
  alignMessage(userId: number): boolean {
    return this.userId === userId ? false : true;
  }

  getMessages(toUserId: number) {
    this.searchData.toUserId = toUserId;
    this.searchData.fromUserId = this.userId;
    this.coronavirusService.searchData(this.searchData)
      .subscribe(data => {
        this.messages = data;
        this.scrollMessageContainer();
      }, error => console.log(error));
  }

  sendMessage(event) {
    debugger;
    // if (event.keyCode === 13) {
    let message;
    if (this.messageForm.controls['message'].value != null) {
      message = this.messageForm.controls['message'].value.trim();
    }

    if ((message === '' || message === undefined || message === null) && (this.ImageBaseData == null || this.ImageBaseData == '')) {
      this.toastr.error('Message can not be empty.', '');
    }
    else {
      let data = {
        fromUserId: this.userId,
        message: message,
        toUserId: this.selectedUserId,
        imageBaseData: this.ImageBaseData,
        fileName: this.FileName,
        fileType: this.FileType,
        isFile: this.ImageBaseData != null ? true : false
      }
      this.coronavirusService.sendMessage(data)
        .subscribe(data => console.log(data), error => console.log(error));
      this.messageForm.reset();     
      this.toastr.success('Message send successfully!', '');
      this.socket.emit('my message', 'Hello there from Angular.');
    }
    // }
  }

  scrollMessageContainer() {
    try {
      this.messageContainer.nativeElement.scrollTop = this.messageContainer.nativeElement.scrollHeight;
    } catch (error) {
      console.warn(error);
    }

  }

  isUserSelected(userId: number): boolean {
    if (!this.selectedUserId) {
      return false;
    }
    return this.selectedUserId === userId ? true : false;
  }

  selectedUser(user, index) {
    this.selectedIndex = index;
    console.log("ToUserID:", user.userId);
    this.selectedUserId = user.userId;
    this.selectedUserName = user.userName;
    this.getMessages(user.userId);
  }

  logout() {
    localStorage.clear();
    this.router.navigateByUrl('/login');
  }

  //Image Upload Code
  handleFileInput(files: FileList) {
    debugger;
    let me = this;
    let file = files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      console.log(reader.result);
      me.ImageBaseData = reader.result.toString().split(',')[1];
      me.FileName = file.name;
      me.FileType = file.type;
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  public base64ToBlob(b64Data, contentType = '', sliceSize = 512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      let slice = byteCharacters.slice(offset, offset + sliceSize);

      let byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      let byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  downloadFile(data) {
    debugger;    
    if (data.imageBaseData) {
      var blob = this.base64ToBlob(data.imageBaseData, data.fileType);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = data.fileName;
      link.click();
      setTimeout(() => {
        window.URL.revokeObjectURL(url);
      }, 100);
    }
  }




}

// export class FileUplodVM {
//   ImageBaseData: string;

// }