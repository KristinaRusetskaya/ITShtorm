import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {CardArticleDataType} from "../../../types/card-article-data.type";
import {ArticlesType} from "../../../types/articles.type";
import {CategoryArticleType} from "../../../types/category-article.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {

  constructor(private http: HttpClient) { }

  getPopularArticles(): Observable<CardArticleDataType[]> {
    return this.http.get<CardArticleDataType[]>(environment.api + 'articles/top');
  }

  getRelatedArticles(url: string): Observable<CardArticleDataType[]> {
    return this.http.get<CardArticleDataType[]>(environment.api + 'articles/related/' + url);
  }

  getArticles(params: ActiveParamsType): Observable<ArticlesType> {
    return this.http.get<ArticlesType>(environment.api + 'articles', {params: params});
  }

  getArticle(url: string): Observable<ArticleType> {
    return this.http.get<ArticleType>(environment.api + 'articles/' + url)
      .pipe()
  }

  getCategories(): Observable<CategoryArticleType[]> {
    return this.http.get<CategoryArticleType[]>(environment.api + 'categories', );
  }
}
