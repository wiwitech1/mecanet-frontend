import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SourceListComponent } from '../../components/source-list/source-list.component';
import { ArticleListComponent } from '../../components/article-list/article-list.component';
import { NewsApiService } from '../../services/news-api.service';
import { Source } from '../../model/source.entity';
import { Article } from '../../model/article.entity';

@Component({
  selector: 'app-news-view',
  standalone: true,
  imports: [CommonModule, SourceListComponent, ArticleListComponent],
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.scss']
})
export class NewsViewComponent implements OnInit {
  sources: Source[] = [];
  articles: Article[] = [];
  selectedSource: Source | null = null;
  loading: boolean = false;

  constructor(private newsApiService: NewsApiService) {}

  ngOnInit() {
    this.loadSources();
  }

  loadSources() {
    this.loading = true;
    this.newsApiService.getSources().subscribe({
      next: (sources) => {
        this.sources = sources;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando fuentes:', error);
        this.loading = false;
      }
    });
  }

  onSourceSelected(source: Source) {
    this.selectedSource = source;
    this.loadArticles(source.id);
  }

  loadArticles(sourceId: string) {
    this.loading = true;
    this.newsApiService.getArticlesBySourceId(sourceId).subscribe({
      next: (articles) => {
        this.articles = articles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando artículos:', error);
        this.loading = false;
      }
    });
  }
}
