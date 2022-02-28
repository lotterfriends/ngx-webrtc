import { Component, ElementRef, ViewContainerRef, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngx-webrtc-conference-grid-holder',
  template: '<ng-content></ng-content>',
  encapsulation: ViewEncapsulation.None,
  styles: [`
    ngx-webrtc-conference-grid-holder {
      display: flex;
      flex: 1;
      border-radius: 10px;
      gap: 20px;
      max-height: 100%;
      max-width: 100%;
      align-content: center;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;  
    }

    .ngx-webrtc-conference-grid-item {
      position: relative;
      vertical-align: middle;
      align-self: center;
      border-radius: 10px;
      overflow: hidden;
      display: inline-block;
      box-shadow:  0 1px 2px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1), 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1), 0 16px 32px rgba(0, 0, 0, 0.1), 0 32px 64px rgba(0, 0, 0, 0.1);
      background: #000;
      animation: show 0.2s ease;
    }

    @keyframes show {
      0% {
          opacity: 0;
          transform: scale(0.4) translateY(20px);
      }

      100% {
          opacity: 1;
          transform: scale(1) translateY(0);
      }
    }
  `]
})
export class ConferenceGridHolderComponent{


  constructor(
    private holderElement: ElementRef,
    private ref: ViewContainerRef
  ) {}

  private margin = 10;
  private ratios = ['4:3', '16:9', '1:1', '1:2'];
  private selectedRatioIndex =  0;
  
  private ratio () {
    const ratio = this.ratios[this.selectedRatioIndex].split(':');
    return parseInt(ratio[1], 10) / parseInt(ratio[0], 10);
  }

  private dimensions(): {holderWidth: number, holderHeight: number } {
    return {
      holderWidth: this.holderElement.nativeElement.offsetWidth - (this.margin * 2),
      holderHeight: this.holderElement.nativeElement.offsetHeight - (this.margin * 2)
    };
  }

  private resizer(width: number): void {
    if (this.ref.element.nativeElement.children.length > 1) {
      for (const node of this.ref.element.nativeElement.children as HTMLElement []) {
        if (!node.classList.contains('ngx-webrtc-conference-grid-item')) {
          node.classList.add('ngx-webrtc-conference-grid-item')
        }
        node.style.margin = this.margin + 'px';
        node.style.width = width + 'px';
        node.style.height = (width * this.ratio()) + 'px';
        node.setAttribute('data-aspect', this.ratios[this.selectedRatioIndex]);
      }
    } else if (this.ref.element.nativeElement.children.length === 1) {
      const node: HTMLElement = this.ref.element.nativeElement.children[0];
      node.style.margin = '0px';
      node.style.width = '100%';
      node.style.height = '100%';
    }
  }

  private area(holderWidth: number, holderHeight: number, increment: number): number | false {
    let elementWidth = 0;
    let elementHeight = increment * this.ratio() + (this.margin * 2);
    [...this.holderElement.nativeElement.children].forEach((): void => {
      if ((elementWidth + increment) > holderWidth) {
        elementWidth = 0;
        elementHeight = elementHeight + (increment * this.ratio()) + (this.margin * 2);
      }
      elementWidth = elementWidth + increment + (this.margin * 2);
    });
    return (elementHeight > holderHeight || increment > holderWidth) ? false : increment;
  }

  public resizeGrid(): void {
    const {holderWidth, holderHeight} = this.dimensions();
    let max = 0;
    let i = 1;
    while (i < holderWidth) {
      if (!this.area(holderWidth, holderHeight, i)) {
        max = i - 1;
        break;
      }
      i++;
    }
    max = max - (this.margin * 2);
    this.resizer(max);
  }


  public removeSize(): void {
    for (const node of this.ref.element.nativeElement.children) {
      node.style.margin =  '';
      node.style.width = '';
      node.style.height = '';
      node.removeAttribute('data-aspect');
    }
  }

}
