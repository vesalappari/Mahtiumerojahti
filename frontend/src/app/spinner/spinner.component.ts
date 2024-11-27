import { Component } from '@angular/core';
import {StateService} from "../services/state.service";

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent {

  constructor(
      public stateService: StateService
  ) {}

}
