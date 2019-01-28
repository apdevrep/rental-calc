import { Component, OnInit, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

//Input of either a number or a percent
@Component({
  selector: 'app-calc-input',
  templateUrl: './calc-input.component.html',
  styleUrls: ['./calc-input.component.css']
})
export class CalcInputComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() inputName: string;
  @Input() inputLabel: string;
  @Input() invalidSubmit?: boolean;
  @Input() defaultText?: string;
  @Input() inputOptions: {
    type: string,
    classes: Array<string> };

  constructor() {
  }

  ngOnInit() {
  }

  //if invalid submit was triggered in parent, style this component
  getInputClasses(){
    if(this.invalidSubmit){
      return this.inputOptions.classes.concat(['invalid-submit']);
    }else {
      return this.inputOptions.classes;
    }
  }

}
