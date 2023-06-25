import { Injectable } from '@angular/core';
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BroadcastService {
  broadcastChannel: BroadcastChannel = new BroadcastChannel('test_channel');

  private onMessage = new Subject<any>();
  onMessage$ = this.onMessage.asObservable();

  constructor() {
    this.broadcastChannel.onmessage = (message) => {
      this.onMessage.next(message.data);
    }
  }

  publish(message: string): void {
    this.broadcastChannel.postMessage(message);
  }
}
