import {SourceResource, SourcesResponse} from "./sources.response";
import {Source} from '../model/source.entity';

export class SourceAssembler {
  
  static toEntitiesFromResponse(response: SourcesResponse): Source[] {
    return response.sources.map((source: SourceResource) => this.toEntityFromResource(source));
  }

  static toEntityFromResource(resource: SourceResource): Source {
    return {
      id: resource.id,
      name: resource.name,
      url: resource.url || '',
      urlToLogo: resource.urlToLogo || ''
    };
  }
}