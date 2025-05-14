import {Component, Input} from '@angular/core';
import {Article} from '../../model/article.entity';
import {MatCardModule} from '@angular/material/card';
import {MatAnchor, MatIconButton} from '@angular/material/button';
import {TranslatePipe} from '@ngx-translate/core';
import {MatIcon} from '@angular/material/icon';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-article-item',
  imports: [MatCardModule, MatAnchor, MatIconButton, MatIcon, TranslatePipe, MatSnackBarModule, DatePipe],
  templateUrl: './article-item.component.html',
  styleUrl: './article-item.component.scss'
})
export class ArticleItemComponent {
  @Input() article!: Article;

  constructor(private snackBar: MatSnackBar) {}

  async shareArticle() {
    const articleShareInfo = {
      title: this.article.title,
      url: this.article.url
    };

    if (navigator.share) {
      try {
        await navigator.share(articleShareInfo);
        this.snackBar.open('Article shared successfully!', 'Close', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Sharing failed.', 'Close', { duration: 3000 });
      }
    } else {
      try {
        await navigator.clipboard.writeText(articleShareInfo.url);
        this.snackBar.open('Article URL copied to clipboard!', 'Close', { duration: 3000 });
      } catch (error) {
        this.snackBar.open('Failed to copy URL.', 'Close', { duration: 3000 });
      }
    }
  }
}
