import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-classfication',
  templateUrl: './classfication.component.html',
  styleUrls: ['./classfication.component.scss']
})

export class ClassficationComponent implements OnInit {

  //PDF Modal variables
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  modalOptions:NgbModalOptions;
  @ViewChild('pdfPreviewModal') modalContent: TemplateRef<any>;

  constructor(private http: HttpClient, private modalService: NgbModal) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
  }

  baseUrl = environment.baseUrl;
  dataSource = [];
  fileList: string[] = [];
  customerList: string[] = [];
  headers: string[] = [];
  rows = [];
  pdfContent: SafeUrl = null;

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  InitializeData(data, self) {
    self.customerList = Object.keys(data);
    const header = {documentType: 'Document Type'};
    const dataMap = {};
    let row = {};
    // tslint:disable-next-line: forin
    for (const customer in data) {
      header[customer] = customer;
      dataMap[customer] = {};
      for (let i = 0; i < data[customer].length; i++) {
        if (self.fileList.indexOf(data[customer][i]['Document Type']) === -1) {
          self.fileList.push(data[customer][i]['Document Type']);
        }
        dataMap[customer][data[customer][i]['Document Type']] = {
          documentName: data[customer][i]['Document Type'],
          customDocumentName: data[customer][i]['Customer Document Type']
        };
      }
    }
    for (let i = 0; i < self.fileList.length; i++) {
      row = {documentType: self.fileList[i]};
      for (let j = 0; j < self.customerList.length; j++) {
        if (dataMap[self.customerList[j]][self.fileList[i]]) {
          row[self.customerList[j]] = dataMap[self.customerList[j]][self.fileList[i]].customDocumentName;
        }
      }
      self.rows.push(row);
    }
    self.headers = ['documentType', ...self.customerList];
  }

  previewSample = (documentType) => {
    this.pdfContent = 'https://cors-anywhere.herokuapp.com/https://s3.amazonaws.com/slu.backenddata/data/samples/' + documentType.replaceAll(' ', '+') + '.pdf';
    this.modalService.open(this.modalContent, { windowClass : 'classification-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onCellClicked = (index, documentType, customerName) => {
    if (index === 0) {
      this.previewSample(documentType);
    } else {
      //TODO. showEditInput();
    }
  }

  callServer(apiPath, callback) {
    const headers = new HttpHeaders()
          .set('Authorization', 'my-auth-token')
          .set('Content-Type', 'application/json');
    const self = this;

    this.http.get(this.baseUrl + apiPath, {
      headers
    })
    .subscribe(data => {
      callback(data, self);
    });
  }
  ngOnInit() {
    this.callServer('/listCustomers', this.InitializeData);
  }

}
