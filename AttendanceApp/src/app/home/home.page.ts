import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public http: HttpClient) { }

  getmsg() {
    this.http.get('http://localhost:8080/api/msg').subscribe(data => {
      alert(data['msg']);
    })
  }

  message: string;
  sendmsg() {
    this.http.post('http://localhost:8080/api/form', { testing: this.message }).subscribe(data => {
      alert(data['msg']);
    })
  }
}
