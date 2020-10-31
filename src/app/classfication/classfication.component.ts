import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-classfication',
  templateUrl: './classfication.component.html',
  styleUrls: ['./classfication.component.scss']
})
export class ClassficationComponent implements OnInit {

  constructor(private http: HttpClient) { }

  baseUrl = environment.baseUrl;
  formatedData = {};

  reformatData(data) {
    // tslint:disable-next-line: forin
    for (const customer in data) {
      this.formatedData[customer] = {};
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < data[customer].length; i++) {
        this.formatedData[customer][data[customer][i]['Document Type']] = data[customer][i]['Customer Document Type'];
      }
    }
  }

  callServer() {
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    this.http.get(this.baseUrl + '/listCustomers', {
      headers
    })
    .subscribe(data => {
      this.reformatData(data);
    });
  }
  ngOnInit() {
    this.callServer();
  }

}
