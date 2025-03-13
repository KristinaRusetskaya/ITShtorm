import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ContentFormRequestType} from "../../../types/content-form-request.type";
import {FormRequestService} from "../../shared/services/form-request.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      }
    },
  }

  public ContentFormRequestType = ContentFormRequestType;
  showedPopup: boolean = false;
  servicePopup: string = '';

  constructor(private formRequestService: FormRequestService) {
  }

  ngOnInit() {
    this.formRequestService.showedPopup$.subscribe((showedPopup: boolean) => {
      this.showedPopup = showedPopup;
    })
  }

  showPopup(service: string): void {
    this.servicePopup = service;
    this.showedPopup = true;
    this.formRequestService.showedPopup$.next(true);
    this.formRequestService.isContent$.next(ContentFormRequestType.full);
  }

}
