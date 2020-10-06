import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })

export class AuthenticationService {
    public currentUser=null

    constructor(private http: HttpClient) {
    }

    public getcurrentUser() 
    {   
        if(this.currentUser)
        {
        return this.currentUser
        }

        let user = localStorage.getItem('currentUser')
        this.currentUser= user?JSON.parse(user):null;

        return this.currentUser
    }

    public setCurrentUser(user) {
                // login successful if there's a jwt token in the response
                if (user) {
                    localStorage.setItem('currentUser',JSON.stringify(user));
                }

            return user;
            
    }

    async logout() {
        // remove user from local storage to log user out
        await localStorage.removeItem('currentUser');
        this.currentUser=null
    }
}