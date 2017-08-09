import { Inject, Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { APP_CONFIG } from '../../../app.config';
import {Project} from '../../../shared/state/project/project.model';

@Injectable()
export class NotificationService {
  private headers = new Headers({'Content-Type': 'application/json'});

  constructor(
    private http: Http,
    @Inject(APP_CONFIG) private config
  ) { }

  accept(projectId): Promise<Project> {
    return this.http
      .get(this.config.apiEndpoint + '/projects/' + projectId + '/accept-invitation', {withCredentials: true})
      .toPromise()
      .then(response => response.json() as Project)
      .catch(this.handleError);
  }

  deny(projectId): Promise<Project> {
    return this.http
      .get(this.config.apiEndpoint + '/projects/' + projectId + '/deny-invitation', {withCredentials: true})
      .toPromise()
      .then(response => response)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }
}
