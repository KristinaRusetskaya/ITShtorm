import {Component, OnInit} from '@angular/core';
import {ArticleCommentsType, ArticleCommentType, ArticleType} from "../../../../types/article.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {ActivatedRoute} from "@angular/router";
import {environment} from "../../../../environments/environment.development";
import {CardArticleDataType} from "../../../../types/card-article-data.type";
import {AuthService} from "../../../core/auth/auth.service";
import {FormBuilder, Validators} from "@angular/forms";
import {CommentService} from "../../../shared/services/comment.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  isLogged: boolean = false;
  article: ArticleType = {
    text: '',
    comments: [],
    commentsCount: 0,
    id: '',
    title: '',
    description: '',
    image: '',
    date: '',
    category: '',
    url: ''
  };

  showedLoader: boolean = false;
  showedButtonDownloadComments: boolean = false;
  currentCountComments: number = 0;

  relatedArticles!: CardArticleDataType[];
  imagesStaticPath = environment.imagesStaticPath;

  constructor(private articlesService: ArticlesService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private fb: FormBuilder,
              private commentService: CommentService,
              private _snackBar: MatSnackBar,) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  commentForm = this.fb.group({
    comment: ['', [Validators.required]],
  })

  ngOnInit(): void {
    this.authService.isLogged$
      .subscribe((isLogged: boolean) => {
        this.isLogged = isLogged;
      })

    this.activatedRoute.params.subscribe(params => {
      this.articlesService.getArticle(params['url'])
        .subscribe((article: ArticleType) => {
          this.article = article;
          const articleTextElement = document.getElementById('article-text');
          if (articleTextElement) {
            articleTextElement.innerHTML = article.text;
          }
          if (article.commentsCount > 3) {
            this.showedButtonDownloadComments = true;
            this.currentCountComments = 3;
          } else {
            this.currentCountComments = article.commentsCount;
          }

          this.commentService.getArticleCommentActions(this.article.id)
            .subscribe((data) => {
              if (data as { comment: string, action: string }[]) {
                data.forEach(item => {
                  this.article.comments.forEach(comment => {
                    if (comment.id === item.comment) {
                      if (item.action === 'like') {
                        comment.likeActive = true;
                      } else if (item.action === 'dislike') {
                        comment.dislikeActive = true;
                      }
                    }
                  })
                })
              }
            })
        })

      this.articlesService.getRelatedArticles(params['url'])
        .subscribe((articles: CardArticleDataType[]) => {
          this.relatedArticles = articles;
        })
    })
  }

  leaveComment() {
    if (this.commentForm.valid && this.commentForm.value.comment) {
      this.commentService.addComment({text: this.commentForm.value.comment, article: this.article.id})
        .subscribe({
          next: (response) => {
            if (response.error) {
              throw new Error(response.message);
            }
            this._snackBar.open(response.message);
            this.commentForm.reset();

            this.activatedRoute.params.subscribe(params => {
              this.articlesService.getArticle(params['url'])
                .subscribe((article: ArticleType) => {
                  this.article.comments = article.comments;
                  this.article.commentsCount = article.commentsCount;

                  if (article.commentsCount > 3) {
                    this.showedButtonDownloadComments = true;
                    this.currentCountComments = 3;
                  } else {
                    this.currentCountComments = article.commentsCount;
                  }
                })
            })
          },
          error: (error: HttpErrorResponse) => {
            if (error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Произошла ошибка при создании комментария! Попробуйте ещё раз.');
            }
          }
        });
    }
  }

  downloadComments() {
    this.showedButtonDownloadComments = false;
    this.showedLoader = true;
    setTimeout(() => {
      this.commentService.getComments({offset: this.currentCountComments, idArticle: this.article.id})
        .subscribe((data: ArticleCommentsType) => {
          if (data.allCount > (10 + this.currentCountComments)) {
            const addedComment = data.comments.slice(0, 10);
            this.article.comments.push(...addedComment);
            this.currentCountComments = this.currentCountComments + 10;
            this.showedButtonDownloadComments = true;
            this.showedLoader = false;
          } else {
            this.article.comments.push(...data.comments);
            this.currentCountComments = this.currentCountComments + data.allCount;
            this.showedButtonDownloadComments = false;
            this.showedLoader = false;
          }
        })
    }, 1000)
  }

  actionsComment(comment: ArticleCommentType, action: string) {
      this.commentService.applyAction(comment.id, action)
        .subscribe({
          next: () => {
            if (action === 'violate') {
              this._snackBar.open('Жалоба отправлена!');
            } else {
              this.commentService.getActionsForComment(comment.id)
                .subscribe({
                  next: data => {
                    if (data as { comment: string, action: string }[]) {
                      const actions = (data as { comment: string, action: string }[]);
                      actions.find(item => item.action === action);
                      if (actions.length === 0) {
                        if (action === 'like') {
                          comment.likesCount -= 1;
                          comment.likeActive = false;
                        } else if (action === 'dislike') {
                          comment.dislikesCount -= 1;
                          comment.dislikeActive = false;
                        }
                      } else {
                        if (action === 'like') {
                          comment.likesCount += 1;
                          comment.likeActive = true;
                          this._snackBar.open('Ваш голос учтен!');
                          if (comment.dislikeActive) {
                            comment.dislikesCount -= 1;
                            comment.dislikeActive = false;
                          }
                        } else if (action === 'dislike') {
                          comment.dislikesCount += 1;
                          comment.dislikeActive = true;
                          this._snackBar.open('Ваш голос учтен!');
                          if (comment.likeActive) {
                            comment.likesCount -= 1;
                            comment.likeActive = false;
                          }
                        }
                      }
                    }
                  }
                })
            }
          },

          error: (error: HttpErrorResponse) => {
            if (action === 'violate') {
              this._snackBar.open('Жалоба уже отправлена!');
            } else {
              if (error.status === 401 || error.status === 403) {
                this._snackBar.open('Произошла ошибка, попробуйте ещё раз!');
              }
            }
          }
        });
    }
}
