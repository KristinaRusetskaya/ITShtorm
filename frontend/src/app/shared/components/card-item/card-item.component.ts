import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CardServiceDataType} from "../../../../types/card-service-data.type";
import {CardArticleDataType} from "../../../../types/card-article-data.type";
import {environment} from "../../../../environments/environment.development";

@Component({
  selector: 'card-item',
  templateUrl: './card-item.component.html',
  styleUrls: ['./card-item.component.scss']
})
export class CardItemComponent implements OnInit{
  @Input()cardServiceData: CardServiceDataType | undefined;
  @Input()cardArticleData: CardArticleDataType | undefined;
  @Output() _showedPopup: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() _servicePopup: EventEmitter<string> = new EventEmitter<string>();
  imagesStaticPath = environment.imagesStaticPath;

  ngOnInit() {

  }

  showPopup(): void {
    if (this.cardServiceData) {
      this._showedPopup.emit(true);
      this._servicePopup.emit(this.cardServiceData.value);
    }
  }
}
