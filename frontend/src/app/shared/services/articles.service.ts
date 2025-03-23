import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {CardArticleDataType} from "../../../types/card-article-data.type";
import {ArticlesType} from "../../../types/articles.type";
import {CategoryArticleType} from "../../../types/category-article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getPopularArticles(): Observable<CardArticleDataType[]> {
    return this.http.get<CardArticleDataType[]>(environment.api + 'articles/top');
  }

  getArticles(): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles');
  }

  getCategories(): Observable<CategoryArticleType[]> {
    return this.http.get<CategoryArticleType[]>(environment.api + 'categories');
  }
}
