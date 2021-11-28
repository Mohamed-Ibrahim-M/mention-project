import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  ElementRef,
  HostListener,
  Renderer2,
  SecurityContext,
  ViewContainerRef,
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MentionItemsComponent } from '../mention-items/mention-items.component';

import $ from 'jquery';

const rightArrow = 'ArrowRight';
const leftArrow = 'ArrowLeft';
const upArrow = 'ArrowUp';
const downArrow = 'ArrowDown';
const enter = 'Enter';

@Directive({
  selector: '[appMention]',
  host: {
    '(keydown)': 'keyHandler($event)',
    '(input)': 'inputHandler($event)',
    // '(mouseover)': 'mouseCache($event)',
  },
})
export class MentionDirectiveDirective {
  mentions = [
    'Gina Williams',
    'Jake Williams',
    'Jamie John',
    'John Doe',
    'Jeff Stewart',
    'Paula M. Keith',
  ];
  private mentionListComp: any = null;
  private compRef_: ComponentRef<MentionItemsComponent>;
  addedNames: String[] = [];

  constructor(
    private elRef: ElementRef,
    private _componentResolver: ComponentFactoryResolver,
    private _viewRef: ViewContainerRef,
    private _render: Renderer2,
    private sanitizer: DomSanitizer
  ) {
    console.log(elRef);
  }

  ngOnInit() {
    this.elRef.nativeElement;
  }

  // mouseCache(e: MouseEvent) {
  //   console.log(e);

  //   if (this.mentionListComp) {
  //     this.mentionListComp.left = e.y;
  //   }
  // }

  keyHandler(e: any) {
    // console.log(e);
    if (e.key === rightArrow && !this.mentionListComp.hide) {
      e.preventDefault();
      return;
    }
    if (e.key === leftArrow && !this.mentionListComp.hide) {
      e.preventDefault();
      return;
    }
    if (e.key === upArrow && !this.mentionListComp.hide) {
      e.preventDefault();
      this.mentionListComp.activeIndex = this.mentionListComp.activeIndex - 1;
      if (this.mentionListComp.activeIndex < 0) {
        this.mentionListComp.activeIndex = this.mentions.length - 1;
      }
    }
    if (e.key === downArrow && !this.mentionListComp.hide) {
      e.preventDefault();
      this.mentionListComp.activeIndex = this.mentionListComp.activeIndex + 1;
      if (this.mentionListComp.activeIndex >= this.mentions.length) {
        this.mentionListComp.activeIndex = 0;
      }
    }
    if (e.key === enter && !this.mentionListComp.hide) {
      e.preventDefault();
      console.log(this.mentions[this.mentionListComp.activeIndex]);
      this.appendTextToTextbox(this.mentions[this.mentionListComp.activeIndex]);
      this.mentionListComp.hide = true;
    }

    if (
      (e.key === 'Escape' || e.key === 'Backspace') &&
      !this.mentionListComp.hide
    ) {
      this.mentionListComp.hide = true;
    }

    if (this.mentionListComp !== null && !this.mentionListComp.hide) {
      e.preventDefault();
      return;
    }

    if (e.key === '@') {
      this.createMentionList();
    }
  }

  inputHandler(e: any) {
    console.log(e);
    this.parseText();
    // console.log(this.elRef);
    // if (e.data === '@') {
    //   this.createMentionList();
    // }
  }

  appendTextToTextbox(text: String) {
    // this._render.setProperty(
    //   this.elRef.nativeElement,
    //   'innerHTML',
    //   this.sanitizer.sanitize(
    //     SecurityContext.HTML,
    //     `<p class='mention-ui'>${text}</p>`
    //   )
    // );
    // console.log(this.getCaretPosition(this.elRef.nativeElement));
    this.addedNames.push(text);
    this.elRef.nativeElement.innerText =
      this.elRef.nativeElement.innerText.replace('@', '') + text;
    this.parseText();
    this.setCaretPosition(
      this.elRef.nativeElement,
      this.getCaretPosition(this.elRef.nativeElement.innerText)
    );
  }

  initializeComponent() {
    console.log(this.elRef.nativeElement);
    const left = this.measureText(this.elRef.nativeElement.innerText).width;
    console.log(left);
    this.mentionListComp.activeIndex = 0;
    this.mentionListComp.el.nativeElement.children[0].style.top =
      this.mentionListComp.top + this.elRef.nativeElement.offsetTop + 'px';
    this.mentionListComp.el.nativeElement.children[0].style.left = left + 'px';
    // this.compRef_.injector.get(ChangeDetectorRef).markForCheck();
    // console.dir(this.mentionListComp.el.nativeElement.children[0].style);
  }

  parseText() {
    this.elRef.nativeElement.innerHTML =
      this.elRef.nativeElement.innerHTML.replace('&nbsp;', ' ');
    let text1 = this.elRef.nativeElement.innerText;
    this.addedNames.forEach((text) => {
      text1 = text1.replaceAll(
        text,
        `<span class='mention-ui'>${text}</span> `
      );
    });
    this.elRef.nativeElement.innerHTML = text1;
    this.setCaretPosition(
      this.elRef.nativeElement,
      this.getCaretPosition(this.elRef.nativeElement.innerText)
    );
  }

  createMentionList() {
    if (this.mentionListComp != null) {
      this.initializeComponent();
      this.mentionListComp.hide = false;
      return;
    }
    let componentFactory = this._componentResolver.resolveComponentFactory(
      MentionItemsComponent
    );
    // let componentRef: ComponentRef<MentionItemsComponent> =
    //   this._viewRef.createComponent(componentFactory);
    this.compRef_ = this._viewRef.createComponent(componentFactory);
    this.mentionListComp = this.compRef_.instance;

    this.initializeComponent();
    this.compRef_.instance['itemSelected'].subscribe((name) => {
      this.elRef.nativeElement.focus();
      console.log('selected', name);
      this.appendTextToTextbox(name);
      this.mentionListComp.hide = true;
      // let fakeKeydown = { key: 'Enter', keyCode: KEY_ENTER, wasClick: true };
      // this.keyHandler(fakeKeydown, nativeElement);
    });
  }

  setCaretPosition(element: any, position: any) {
    const range = document.createRange();
    const selection = window.getSelection();

    //select appropriate node
    let currentNode = null;
    let previousNode = null;

    for (let i = 0; i < element.childNodes.length; i++) {
      //save previous node
      previousNode = currentNode;

      //get current node
      currentNode = element.childNodes[i];
      //if we get span or something else then we should get child node
      while (currentNode.childNodes.length > 0) {
        currentNode = currentNode.childNodes[0];
      }

      //calc offset in current node
      if (previousNode != null) {
        position -= previousNode.length;
      }
      //check whether current node has enough length
      if (position <= currentNode.length) {
        break;
      }
    }
    //move caret to specified offset
    if (currentNode != null) {
      range.setStart(currentNode, position);
      range.collapse(true);
      if (selection != null) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

  getCaretPosition(element: any) {
    // var sel = document.getSelection();
    // let pos = 0;
    // if (sel !== null) {
    //   pos = sel.toString().length;
    //   if (sel.anchorNode != undefined) sel.collapseToEnd();
    // }
    // console.log(pos);
    return element.length;
    // console.dir(element);
    // let position = 0;
    // if (window.getSelection()) {
    //   console.log(window.getSelection());
    //   const selection = window.getSelection();
    //   if (selection != null && selection.rangeCount > 0) {
    //     const range = selection.getRangeAt(0);
    //     const preCaretRange = range.cloneRange();
    //     preCaretRange.selectNodeContents(element);
    //     preCaretRange.setEnd(range.endContainer, range.endOffset);
    //     position = preCaretRange.toString().length;
    //   }
    // }
    // console.log(position);
    // return position;
  }

  getElementOfCurrentCaret() {
    const selection = window.getSelection();
    if (selection !== null) {
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        return (
          range.startContainer === range.endContainer
            ? range.startContainer
            : range.commonAncestorContainer
        ).parentNode;
      }
    }
    return document;
  }

  measureText(pText: string) {
    let dSpan = document.createElement('span');

    document.body.appendChild(dSpan);

    dSpan.innerHTML = pText;
    console.dir(dSpan);
    const lResult = {
      width: dSpan.getBoundingClientRect().width.toFixed(),
      height: dSpan.clientHeight,
    };

    document.body.removeChild(dSpan);
    return lResult;
  }
}
