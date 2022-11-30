import { Component, Injectable, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

export class BaseComponent {

  constructor(private spinner: NgxSpinnerService) {

  }

  showSpinner(spinnerType: SpinnerType) {
    this.spinner.show(spinnerType);
  }

  hideSpinner(spinnerType: SpinnerType) {
    this.spinner.hide(spinnerType)
  }
}

export enum SpinnerType {
  BallScaleMultiple = "s1",
  BallSpinClockwise = "s2",
  LineScale = "s3"
}
