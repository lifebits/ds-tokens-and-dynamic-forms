import {ChangeDetectorRef, Component, HostListener, OnInit} from '@angular/core';
import { BroadcastService } from './broadcast.service';

@Component({
  standalone: true,
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  providers: [ BroadcastService ]
})
export class PerformanceComponent implements OnInit {
  counter = 0;

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(event: any) {
    debugger;
    console.log(event);
    event.returnValue = 'Sure?';
    // return 'Sure?';
    return 'Sure!';
  }

  constructor(private broadcast: BroadcastService, private cdr: ChangeDetectorRef) {
    // const ask = true;
    // window.onbeforeunload = function (e) {
    //   debugger;
    //   console.log(1111, e);
    //   if(!ask) return null
    //   e = e || window.event;
    //   //old browsers
    //   if (e) {e.returnValue = 'Sure?';}
    //   //safari, chrome(chrome ignores text)
    //   return 'Sure?';
    // };
  }

  ngOnInit(): void {
    this.broadcast.onMessage$
      .subscribe((message) => {
        this.counter = message;
        this.cdr.detectChanges();
        console.log(message);
      });
  }

  onSendMsg(): void {
    this.counter = ++this.counter;
    console.log('ON_CLICK', this.counter);
    this.broadcast.publish(String(this.counter));
  }
}
