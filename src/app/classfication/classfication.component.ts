import { Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {NgbModal, ModalDismissReasons, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { SafeUrl } from '@angular/platform-browser';
import { GlobalService } from '../service/global.service';
import { cloneDeep } from 'lodash';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-classfication',
  templateUrl: './classfication.component.html',
  styleUrls: ['./classfication.component.scss']
})

export class ClassficationComponent implements OnInit {

  // PDF Modal variables
  title = 'ng-bootstrap-modal-demo';
  closeResult: string;
  modalOptions: NgbModalOptions;
  @ViewChild('pdfPreviewModal') modalContent: TemplateRef<any>;

  constructor(private http: HttpClient, private modalService: NgbModal, protected commonService: GlobalService) {
    this.modalOptions = {
      backdrop: 'static',
      backdropClass: 'customBackdrop'
    }
  }

  dataSource = [];
  documentList: string[] = [];
  customerList: string[] = [];
  fileDropdonwList: object[] = [];
  customerDropdownList: object[] = [];
  headers: string[] = [];
  rows = [];
  pdfContent: SafeUrl = null;
  uploadFileName: string;
  selectedCustomers = [];
  selectedFiles = [];
  filteredRows = [];
  showElement = {};
  documentMap = {};
  modalReference;
  dropdownSettings = {
    singleSelection: false,
   // idField: 'item_id',
   // textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  InitializeData() {
    const data = this.commonService.getRawData();
    this.customerList = this.commonService.getCustomerList();
    this.documentList = this.commonService.getDocumentList();
    this.documentMap = this.commonService.getDocumentMap();
    const header = {documentType: 'Document Type'};
    const dataMap = {};
    let row = {};
    // tslint:disable-next-line: forin
    for (const customer in data) {
      header[customer] = customer;
      dataMap[customer] = {};
      for (let i = 0; i < data[customer].length; i++) {
        dataMap[customer][data[customer][i]['Document Type']] = {
          documentName: data[customer][i]['Document Type'],
          customDocumentName: data[customer][i]['Customer Document Type']
        };
      }
    }
    for (let i = 0; i < this.documentList.length; i++) {
      row = {documentType: this.documentList[i]};
      for (let j = 0; j < this.customerList.length; j++) {
        if (dataMap[this.customerList[j]][this.documentList[i]]) {
          row[this.customerList[j]] = dataMap[this.customerList[j]][this.documentList[i]].customDocumentName;
        } else {
          row[this.customerList[j]] = '';
        }
      }
      this.rows.push(row);
    }
    this.fileDropdonwList = this.documentList.map((customer: string, index: number) => ({item_id: index, item_text: customer}));
    this.customerDropdownList = this.customerList.map((customer: string, index: number) => ({item_id: index, item_text: customer}));
    this.headers = ['documentType', ...this.customerList];
  }

  onCellClicked = (index, documentType, customerName) => {
    if (index === 0) {
      this.previewSample(documentType);
      this.uploadFileName = documentType;
    } else {
      this.showElement[documentType + customerName] = true;
      // TODO. showEditInput();
    }
  }

  onItemSelect(items: any, type: string, dropdown: string) {
    if (Array.isArray(items)) {
      if (type === 'selectAll') {
        if (dropdown === 'customer') {
          this.selectedCustomers = items;
        } else {
          this.selectedFiles = items;
        }
      } else {
        if (dropdown === 'customer') {
          this.selectedCustomers = [];
        } else {
          this.selectedFiles = [];
        }
      }
    }
    if (this.selectedCustomers.length === 0 || this.selectedFiles.length === 0 ) {
      this.filteredRows = [];
    } else {
      // Filter by document type.
      this.filteredRows = cloneDeep(this.rows.filter(row => this.selectedFiles.includes(row.documentType)));
      const customerList = this.selectedCustomers;
      for (let i = 0; i < this.filteredRows.length; i++) {
        for (const customer in this.filteredRows[i]) {
          if (customerList.indexOf(customer) === -1 && customer !== 'documentType') {
            delete this.filteredRows[i][customer];
          }
        }
      }
      this.headers = ['documentType', ...customerList];
    }
  }

  previewSample = (documentType) => {
    if (this.documentMap[documentType].length === 0) {
      this.showElement['noPDF'] = true;
      this.pdfContent = null;
    } else {
      this.showElement['noPDF'] = false;
      this.pdfContent = 'https://s3.amazonaws.com/slu.backenddata/data/'
                        + this.documentMap[documentType].replaceAll(' ', '+');
    }
    this.modalService.open(this.modalContent, { windowClass : 'classification-modal'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  uploadPDF = () => {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/pdf'
    });
    this.http.post(this.commonService.getBaseUrl() + '\\uploadPDF', {requestData: this.pdfContent, fileName: this.uploadFileName}, {headers: headers})
    .subscribe(data => {
      // Reset pdf links.
      this.uploadFileName = null;
      this.pdfContent = null;
      this.modalService.dismissAll();
      if (data['status'] === 200) {
        this.documentMap[data['documentType']] = data['documentPath'];
        // Update global values in common service.
        this.commonService.setDocumentMap(this.documentMap);
        Swal.fire('File uploaded successfully!');
      } else {
        Swal.fire('An error occurred when uploading sample file.');
      }
    });
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    const caller = this;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      const reader = new FileReader();

      reader.onload = function(e: any) {
        caller.pdfContent =  e.target.result;
      };
      reader.readAsDataURL(file);
  }
}

  inputChanged = (e, rowIndex, documentType, customerName) => {
    const value = e.target.value;
    if (!value || value.length === 0) {
      return;
    }
    this.filteredRows[rowIndex][customerName] = value;
    this.commonService.callServer('/updateValue', function() {
      Swal.fire('Updated Successfully');
    } , 'post', {value: value, documentType: documentType, customerName: customerName});
  }

  // Initialization
  ngOnInit() {
    const component = this;
    if (!this.commonService.getRawData()) {
      this.commonService.InitializeData().then(function() {
        component.InitializeData();
      });
    } else {
      this.InitializeData();
    }
  }

}
