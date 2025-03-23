import {Component, OnInit} from '@angular/core';
import {OwlOptions} from "ngx-owl-carousel-o";
import {ContentFormRequestType} from "../../../types/content-form-request.type";
import {FormRequestService} from "../../shared/services/form-request.service";
import {CardServiceDataType} from "../../../types/card-service-data.type";
import {ArticlesService} from "../../shared/services/articles.service";
import {CardArticleDataType} from "../../../types/card-article-data.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  cardsService: CardServiceDataType[] = [
    {
      image: '../../../assets/images/card/card-image1.png',
      title: 'Создание сайтов',
      value: 'website-creation',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500
    },
    {
      image: '../../../assets/images/card/card-image2.png',
      title: 'Продвижение',
      value: 'promotion',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500
    },
    {
      image: '../../../assets/images/card/card-image3.png',
      title: 'Реклама',
      value: 'advertising',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000
    },
    {
      image: '../../../assets/images/card/card-image4.png',
      title: 'Копирайтинг',
      value: 'copywriting',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750
    },
  ];

  cardsArticle: CardArticleDataType[] = [];

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

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 25,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
  }

  public ContentFormRequestType = ContentFormRequestType;
  showedPopup: boolean = false;
  servicePopup: string = '';

  constructor(private formRequestService: FormRequestService,
              private articlesService: ArticlesService,) {
  }

  ngOnInit() {
    this.articlesService.getPopularArticles()
      .subscribe((data: CardArticleDataType[]) => {
        this.cardsArticle = data;
      })
  }

  hidePopup(_showedPopup: boolean) {
    this.showedPopup = _showedPopup;
  }

  getShowedPopup(_showedPopup: boolean) {
    this.showedPopup = _showedPopup;
  }

  getServicePopup(_servicePopup: string) {
    this.servicePopup = _servicePopup;
  }

  showPopup(service: string): void {
    this.servicePopup = service;
    this.showedPopup = true;
  }

}
