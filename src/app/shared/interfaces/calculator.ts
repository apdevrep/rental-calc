export interface Calculator {
  ngOnInit();
  resetFormControlValues();
  loadOtherInputs(otherInputs: any);
  getPreviousSubmittedProperty();
  initVizOptions();
  saveSubmission();
}
