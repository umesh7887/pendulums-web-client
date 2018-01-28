import {ComponentFactoryResolver, Injectable, ViewContainerRef, ApplicationRef} from '@angular/core';
import { ErrorComponent } from './error.component';

@Injectable()
export class ErrorService {
  private errorComponentRef;
  private rootViewContainerRef: ViewContainerRef;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private applicationRef: ApplicationRef
  ) {
      // get root viewContainerRef
      this.rootViewContainerRef = this.applicationRef.components[0].instance.viewContainerRef;
  }

  show(errorConfig: ErrorConfig) {
    if (this.errorComponentRef) {
      this.errorComponentRef.instance['errorMessages'].push(errorConfig.input);
      return;
    }

    const errorFactory = this.componentFactoryResolver.resolveComponentFactory(ErrorComponent);
    this.errorComponentRef = this.rootViewContainerRef.createComponent(errorFactory);


    if (errorConfig.input) {
     this.errorComponentRef.instance['errorMessages'].push(errorConfig.input);
    }

    this.errorComponentRef.instance['close'].subscribe(() => this.close());
    this.errorComponentRef.changeDetectorRef.detectChanges();
  }

  close() {
    // cleanup
    this.errorComponentRef.destroy();
    this.errorComponentRef = null;
  }
}

interface ErrorConfig {
  input?:  string;
}
