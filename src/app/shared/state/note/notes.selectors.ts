import { createSelector }             from '@ngrx/store';
import { values }                     from 'lodash';
import { Injectable }                 from '@angular/core';
import { Note }                    from './note.model';
import { Notes }                   from './notes.model';

/**
 *  Because the data structure is defined within the reducer it is optimal to
 *  locate our selector functions at this level. If store is to be thought of
 *  as a database, and reducers the tables, selectors can be considered the
 *  queries into said database. Remember to keep selectors small and
 *  focused so they can be combined and composed to fit each particular
 *  use-case.
 */

@Injectable()
export class NotesSelectors {
  getEntities = (state: Notes) => state.entities;
  getSortBy = (state: Notes) => state.sortBy;
  // tslint:disable-next-line: member-ordering
  getAllArray = createSelector(this.getEntities, this.getSortBy, (entities, sortBy) => {
    return values<Note>(entities).sort((n1, n2) => {
      switch (sortBy) {
        case '+date': {
          return n1.id > n2.id ? 1 : -1;
        }
        case '-date': {
          return n1.id < n2.id ? 1 : -1;
        }
        case '+title': {
          return n1.title.toLowerCase() >= n2.title.toLowerCase() ? 1 : -1;
        }
        case '-title': {
          return n1.title.toLowerCase() < n2.title.toLowerCase() ? 1 : -1;
        }
      }
    });
  });
}
