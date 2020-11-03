import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { ExportToCsv } from 'export-to-csv';
import { cloneDeep } from 'lodash';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.scss']
})
export class ExtractionComponent implements OnInit {
  public fileList: string[];
  constructor(private commonService: GlobalService) {}

  selectedDocumentType: string;
  dataElements = {};
  groups = [];
  showElement = {};
  pdfContent: string;
  documentMap = {};

  dropdownSettings = {
    singleSelection: true,
    allowSearchFilter: true
  };
  selectedDataElements = [];

  InitializeData() {
    const dataElements = this.commonService.getDataElements();
    dataElements.forEach(row => {
      if (!this.dataElements[row['Document Type']]) {
        this.dataElements[row['Document Type']] = [];
      }
      this.dataElements[row['Document Type']].push(row);
    });
    this.fileList = this.commonService.getDocumentList();
    this.documentMap = this.commonService.getDocumentMap();
  }

  onItemSelect(items: any, type: string, dropdown: string) {
    if (!this.dataElements[this.selectedDocumentType[0]]) {
      this.showElement['noFields'] = true;
    } else {
      this.showElement['noFields'] = false;
      this.groups = [];
      // Filter by document type.
      this.selectedDataElements = cloneDeep(this.dataElements[this.selectedDocumentType[0]]).sort(function(a, b) {
        return a['Group Number'] - b['Group Number'] || a['Datapoint Order'] - b['Datapoint Order'];
      });
      this.selectedDataElements.forEach(row => {
        if (this.groups.indexOf(row['Group Number']) === -1) {
        this.groups.push(row['Group Number']);
      }});
      if (this.documentMap[this.selectedDocumentType[0]].length === 0) {
        this.showElement['noPDF'] = true;
        this.pdfContent = null;
      } else {
        this.showElement['noPDF'] = false;
        this.pdfContent = 'https://s3.amazonaws.com/slu.backenddata/data/'
        + this.commonService.getDocumentMap()[this.selectedDocumentType[0]].replaceAll(' ', '+');
      }
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    const newGroup = this.selectedDataElements[event.currentIndex]['Group Number'];
    moveItemInArray(this.selectedDataElements, event.previousIndex, event.currentIndex);
    this.selectedDataElements[event.currentIndex]['Group Number'] = newGroup;
  }

  exportTXT = () => {
    const a = document.createElement('a');
    document.body.appendChild(a);
    a.setAttribute('style', 'display: none');
    const data = this.selectedDataElements.map(row => row['Data Elements']).join('%0D%0A');
    a.download = 'fields.txt';
    a.href = 'data:text/plain,' + data;
    a.click();
    //window.URL.revokeObjectURL(url);
  }

  exportExtractionData = () => {
    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: false,
      filename: 'Extraction Export',
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true
    };
    const csvExporter = new ExportToCsv(options);
    const exportData = [];
    let maxFieldsCount = 0;
    let row: object;
    Object.values(this.dataElements).every((file: []) => maxFieldsCount = Math.max(maxFieldsCount, file.length));
    for (let i = 0; i < maxFieldsCount; i++) {
      row = {};
      Object.keys(this.dataElements).forEach(file => row[file] = this.dataElements[file][i] ? this.dataElements[file][i]['Data Elements'] : '');
      exportData.push(row);
    }
    csvExporter.generateCsv(exportData);
  }

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
