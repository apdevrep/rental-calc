import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

//To be used in the future after conversion to Reactive Form
@Component({
  selector: 'app-calc-input',
  templateUrl: './calc-input.component.html',
  styleUrls: ['./calc-input.component.css']
})
export class CalcInputComponent implements OnInit {
  @Input() sharedInput: string;
  @Input() invalid: boolean;
  @Input() inputOptions: {
    label: string,
    type: string,
    name: string,
    required: boolean,
    classes: Array<string> };
  @Output() sharedInputChange = new EventEmitter();

  constructor() {
  }

  ngOnInit() {
  }

  getInputClasses(){
    if(this.invalid){
      return this.inputOptions.classes.concat['invalid-submit'];
    }else {
      return this.inputOptions.classes;
    }
  }

  change(newValue) {
    this.sharedInput = newValue;
    this.sharedInputChange.emit(newValue);
  }

}
