import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private loadingState = new BehaviorSubject<boolean>(false);
  isLoading$ = this.loadingState.asObservable();

  constructor() { }

  startLoading() {
    this.loadingState.next(true);
  }

  stopLoading() {
    this.loadingState.next(false);
  }
}
