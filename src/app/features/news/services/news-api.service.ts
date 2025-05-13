import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Source} from '../model/source.entity';
import {SourcesResponse} from './sources.response';
import {Article} from '../model/article.entity';
import {TopHeadlinesResponse} from './top-headlines.response';
import {SourceAssembler} from './source.assembler';
import {ArticleAssembler} from './article.assembler';

@Injectable({
  providedIn: 'root'
})
export class NewsApiService {
  private baseUrl = "http://localhost:3000/api/v1/";
  private newsEndpoint = "top-headlines";
  private sourcesEndpoint = "sources";
  
  constructor(private http: HttpClient) {}

  getSources(): Observable<Source[]> {
    return this.http.get<SourcesResponse>(`${this.baseUrl}${this.sourcesEndpoint}`).pipe(
      map(response => SourceAssembler.toEntitiesFromResponse(response))
    );
  }

  getArticlesBySourceId(sourceId: string): Observable<Article[]> {
    return this.http.get<TopHeadlinesResponse>(`${this.baseUrl}${this.newsEndpoint}`, {
      params: { 'source.id': sourceId }
    }).pipe(
      map(response => ArticleAssembler.toEntitiesFromResponse(response))
    );
  }
}