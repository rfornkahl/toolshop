import { Component, EventEmitter } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, FormsModule, NgControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend';
  form: FormGroup;
  constructor(fb:FormBuilder) {
   this.form=fb.group({
     phone:['']
   })
 }
}
