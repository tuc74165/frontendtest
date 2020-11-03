import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';
import { cloneDeep } from 'lodash';

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.scss']
})
export class ExtractionComponent implements OnInit {
  public fileList: string[];
  constructor(private commonService: GlobalService) {}

  selectedDocumentType: string;
  dataElements;
  dropdownSettings = {
    singleSelection: true,
    allowSearchFilter: true
  };
  selectedDataElements = [];

  InitializeData() {
    this.fileList = this.commonService.getDocumentList();
    this.dataElements = this.commonService.getDataElements();
  }

  onItemSelect(items: any, type: string, dropdown: string) {
    // Filter by document type.
    this.selectedDataElements = cloneDeep(this.dataElements.filter(row => row['Document Type'] === this.selectedDocumentType[0]).sort(function(a, b) {
      return a['Group Number'] - b['Group Number'] || a['Datapoint Order'] - b['Datapoint Order'];
    }));
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
