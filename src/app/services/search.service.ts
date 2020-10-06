import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mergeMap } from 'rxjs/operators';
import { pipe } from 'rxjs'


@Injectable()
export class SearchService {

    queryString=new Subject<string>()

    resetValue()
    {
        this.queryString.next('');
    }

    getValue() {

    return this.queryString.pipe(
          debounceTime(1000),
          distinctUntilChanged(),     
          )
    }

    getCurrentValue()
    {
        return this.queryString.pipe(
            distinctUntilChanged(),     
            )
    }

    setValue(key:string)
    {
    this.queryString.next(key);
    }
}