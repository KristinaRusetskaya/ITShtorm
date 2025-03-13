import {Component, Input, OnInit} from '@angular/core';
import {FormRequestService} from "../../services/form-request.service";
import {ContentFormRequestType} from "../../../../types/content-form-request.type";
import {FormBuilder, Validators} from "@angular/forms";
import {DataType, RequestsDataType} from "../../../../types/requests-data.type";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'form-request',
  templateUrl: './form-request.component.html',
  styleUrls: ['./form-request.component.scss']
})
export class FormRequestComponent implements OnInit{
  @Input() servicePopup!: string;
  public ContentFormRequestType = ContentFormRequestType;
  showedPopup: boolean = true;
  isContent!: ContentFormRequestType;
  errorResponseMessage: string = '';

  requestForm = this.fb.group({
    service: [this.servicePopup],
    name: ['', Validators.required],
    phone: ['', Validators.required]
  });

  constructor(private formRequestService: FormRequestService,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.formRequestService.showedPopup$.subscribe((showedPopup: boolean) => {
      this.showedPopup = showedPopup;
    })
    // this.formRequestService.isContent$.subscribe((isContent: ContentFormRequestType) => {
    //   this.isContent = isContent;
    // })
  }

  hidePopup(): void {
    this.showedPopup = false;
    this.formRequestService.showedPopup$.next(false);
  }

  orderConsultation() {
    this.requestForm.markAllAsTouched();

    if (this.requestForm.valid && this.requestForm.value.name && this.requestForm.value.phone) {
      const userData: RequestsDataType = {
        name: this.requestForm.value.name,
        phone: this.requestForm.value.phone,
        type: DataType.consultation
      }

      this.formRequestService.requestOrderConsultation(userData)
        .subscribe({
          next: () => {
            this.isContent = ContentFormRequestType.completed;
          },
          error: (error: HttpErrorResponse) => {
            if (error.error && error.error.message) {
              this.errorResponseMessage = error.error.message;
            } else {
              this.errorResponseMessage = 'Произошла ошибка при отправке формы, попробуйте еще раз.';
            }
          }
          });
    }
  }
}
