import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../service/global.service';

@Component({
  selector: 'app-extraction',
  templateUrl: './extraction.component.html',
  styleUrls: ['./extraction.component.scss']
})
export class ExtractionComponent implements OnInit {
  public fileList: string[];
  constructor(private commonService: GlobalService) {}

  selectedFiles = [];
  dropdownSettings = {
    singleSelection: false,
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 1,
    allowSearchFilter: true
  };

  InitializeData() {
    this.fileList = this.commonService.getDocumentList();
  }

  onItemSelect(items: any, type: string, dropdown: string) {

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
