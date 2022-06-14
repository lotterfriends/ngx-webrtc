## Installation


To install this library, run:

```bash
$ npm install ngx-webrtc --save
```

Add library to your Angular `AppModule`:


```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { NgxWebrtcModule } from 'ngx-webrtc';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
     NgxWebrtcModule.forRoot({
       userIdentifier: 'id'
     })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
