import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-mention-items',
  templateUrl: './mention-items.component.html',
  styleUrls: ['./mention-items.component.css'],
})
export class MentionItemsComponent {
  @Output() itemSelected = new EventEmitter<String>();

  @ViewChild('mentionItems', { static: true }) mentionList: ElementRef;

  mentions = [
    'Gina Williams',
    'Jake Williams',
    'Jamie John',
    'John Doe',
    'Jeff Stewart',
    'Paula M. Keith',
  ];

  hide = false;

  top = 20;

  activeIndex = 0;

  constructor(private el: ElementRef, private cdr: ChangeDetectorRef) {
    // console.log(el);
    // el.nativeElement.focus();
    // // this.mentionList = el
  }

  itemSelect(index: number) {
    console.log(this.mentions[index]);
    this.itemSelected.emit(this.mentions[index]);
  }
}
