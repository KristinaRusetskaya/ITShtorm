import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment.development";
import {HttpClient} from "@angular/common/http";
import {ArticleCommentsType} from "../../../types/article.type";

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  addComment(commentData: {text: string, article: string}): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments', commentData);
  }

  getComments(commentsData: {offset: number, idArticle: string}): Observable<ArticleCommentsType> {
    return this.http.get<ArticleCommentsType>(environment.api + 'comments', {params: {offset: commentsData.offset, article: commentsData.idArticle}});
  }

  applyAction(idComment: string, action: string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'comments/' + idComment + '/apply-action', {'action': action});
  }

  getActionsForComment(idComment: string): Observable<{comment: string, action: string}[] | []> {
    return this.http.get<{comment: string, action: string}[] | []>(environment.api + 'comments/' + idComment + '/actions');
  }

  getArticleCommentActions(articleId: string): Observable<{comment: string, action: string}[] | []> {
    return this.http.get<{comment: string, action: string}[] | []>(environment.api + 'comments/article-comment-actions', {params: {articleId: articleId}});
  }
}
