import {Component, OnInit} from '@angular/core';
import {FormRequestService} from "../../services/form-request.service";
import {ContentFormRequestType} from "../../../../types/content-form-request.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public ContentFormRequestType = ContentFormRequestType;
  showedPopup: boolean = false;


  constructor(private formRequestService: FormRequestService) {
  }

  hidePopup(_showedPopup: boolean) {
    this.showedPopup = _showedPopup;
  }

  showPopup(): void {
    this.showedPopup = true;
  }

}
