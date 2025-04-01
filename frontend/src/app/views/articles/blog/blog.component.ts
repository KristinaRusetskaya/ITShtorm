import {Component, HostListener, OnInit} from '@angular/core';
import {ArticlesType} from "../../../../types/articles.type";
import {ArticlesService} from "../../../shared/services/articles.service";
import {CategoryArticleType} from "../../../../types/category-article.type";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActivatedRoute, Router} from "@angular/router";
import {debounceTime} from "rxjs";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  articles: ArticlesType = {count: 0, pages: 0, items: []};
  pages: number[] = [];
  categoriesArticle: CategoryArticleType[] = [];
  filterOpen: boolean = false;
  activeParams: ActiveParamsType = {page: 1, categories: []};
  appliedCategories: CategoryArticleType[] = [];

  constructor(private articleService: ArticlesService,
              private router: Router,
              private activatedRoute: ActivatedRoute,) {

  }

  ngOnInit() {
    this.articleService.getCategories()
      .subscribe((data: CategoryArticleType[]) => {
        this.categoriesArticle = data;

        this.activatedRoute.queryParams
          .pipe(
            debounceTime(500)
          )
          .subscribe((params) => {
            this.activeParams = ActiveParamsUtil.processParams(params);

            this.activeParams.categories.forEach(url => {
              const foundCategory: CategoryArticleType | undefined = this.categoriesArticle.find(item => item.url === url);
              if (foundCategory) {
                if (this.appliedCategories.length > 0) {
                  for (let i = 0; i < this.appliedCategories.length; i++) {
                    const isStock: boolean = !!this.appliedCategories.find(item => item.url === foundCategory.url);
                    if (!isStock) {
                      this.categoriesArticle = this.categoriesArticle.map(item => {
                        if (item.url === foundCategory.url) {
                          item.isActive = true;
                          return item;
                        } else {
                          return item;
                        }
                      });
                      this.appliedCategories.push({
                        id: foundCategory.id,
                        name: foundCategory.name,
                        url: foundCategory.url
                      });
                    }
                  }
                } else {
                  this.categoriesArticle = this.categoriesArticle.map(item => {
                    if (item.url === foundCategory.url) {
                      item.isActive = true;
                      return item;
                    } else {
                      return item;
                    }
                  });
                  this.appliedCategories.push({
                    id: foundCategory.id,
                    name: foundCategory.name,
                    url: foundCategory.url
                  });
                }
              }
            });

            this.articleService.getArticles(this.activeParams)
              .subscribe((data: ArticlesType) => {
                this.articles = data;
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
              })
          })
      })
  }

  toggleFilter() {
    this.filterOpen = !this.filterOpen;
  }

  updateActiveCategory(category: CategoryArticleType) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === category.url);
      if (existingTypeInParams) {
        category.isActive = false;
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== category.url);
        this.appliedCategories = this.appliedCategories.filter(item => item.url !== category.url);
      } else {
        category.isActive = true;
        this.activeParams.categories = [...this.activeParams.categories, category.url];
      }
    } else {
      category.isActive = true;
      this.activeParams.categories = [category.url];
    }

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    }).then();
  }

  removeCategory(category: CategoryArticleType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== category.url);
    this.appliedCategories = this.appliedCategories.filter(item => item.url !== category.url);
    this.categoriesArticle = this.categoriesArticle.map(item => {
      if (item.url === category.url) {
        item.isActive = false;
        return item;
      } else {
        return item;
      }
    });

    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    }).then();
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    }).then()
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      }).then()
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      }).then()
    } else {
      this.activeParams.page = 2;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      }).then()
    }
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.filterOpen && event.target instanceof HTMLElement) {
      this.filterOpen = event.target.className.includes('blog-filter') || event.target.className.includes('blog-filter-head') || event.target.className.includes('blog-filter-span');
    }
  }
}
