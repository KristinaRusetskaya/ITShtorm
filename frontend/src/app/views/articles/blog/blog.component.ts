import {Component, OnInit} from '@angular/core';
import {ArticlesType} from "../../../../types/articles.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {CategoryArticleType} from "../../../../types/category-article.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {Router} from "@angular/router";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticlesType = {count: 0, pages: 0, items: []};
  categoriesArticle: CategoryArticleType[] = [];
  filterOpen: boolean = false;
  activeParams: ActiveParamsType = {page: 0, categories: []};

  constructor(private articleService: ArticlesService,
              private router: Router) {

  }

  ngOnInit() {
    this.articleService.getArticles()
      .subscribe((data: ArticlesType) => {
        this.articles = data;
      })

    this.articleService.getCategories()
      .subscribe((data: CategoryArticleType[]) => {
        this.categoriesArticle = data;
      })
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  updateActiveCategory(category: CategoryArticleType) {
    if (this.activeParams.categories.length > 0) {
      const existingCategoryInParams: string | undefined = this.activeParams.categories.find(item => item === category.url)
      if (existingCategoryInParams) {
        this.activeParams.categories.filter(item => item !== existingCategoryInParams);
      } else {
        this.activeParams.categories = [...this.activeParams.categories, category.url];
      }
    } else {
      this.activeParams.categories = [category.url];
    }
    console.log(this.activeParams);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    }).then();
  }
}
