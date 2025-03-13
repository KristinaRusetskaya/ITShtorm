import {Component, OnInit} from '@angular/core';
import {FormRequestService} from "../../services/form-request.service";
import {ContentFormRequestType} from "../../../../types/content-form-request.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit{
  public ContentFormRequestType = ContentFormRequestType;
  showedPopup: boolean = false;


  constructor(private formRequestService: FormRequestService) {
  }

  ngOnInit() {
    this.formRequestService.showedPopup$.subscribe((showedPopup: boolean) => {
      this.showedPopup = showedPopup;
    })
  }

  showPopup(): void {
    this.showedPopup = true;
    this.formRequestService.showedPopup$.next(true);
    this.formRequestService.isContent$.next(ContentFormRequestType.abbreviated);
  }

}
