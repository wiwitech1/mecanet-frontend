import {Component, Input} from '@angular/core';
import {Article} from '../../model/article.entity';
import {ArticleItemComponent} from '../article-item/article-item.component';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  imports: [
    ArticleItemComponent
  ],
  styleUrl: './article-list.component.scss'
})
export class ArticleListComponent {
  @Input() articles: Array<Article> = [];
}
