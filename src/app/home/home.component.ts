import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public router: Router, public route: ActivatedRoute) { }

  ngOnInit() {
  }

  goToClassification(){
    this.router.navigate(['../classification'], { relativeTo: this.route });
  }

  goToExtraction(){
    this.router.navigate(['../extraction'], { relativeTo: this.route });
  }
}
