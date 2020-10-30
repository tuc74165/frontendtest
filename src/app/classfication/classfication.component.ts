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

  callServer() {
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');

    this.http.get(this.baseUrl + '/listCustomers', {
      headers
    })
    .subscribe(data => {debugger;
      console.log(data);
    });
  }
  ngOnInit() {
    this.callServer();
  }

}
