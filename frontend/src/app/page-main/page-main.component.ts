import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user/user.service';
import { Store } from '@ngrx/store';
import { Observable, Subject, take, takeUntil } from 'rxjs';
import { User } from '../user/user.model';
//import * as PostActions from '../post/post.actions';
import { AuthEffects,State, loginRequest, loginS } from '../user/auth.actions';
import { Actions, ofType } from '@ngrx/effects';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { ActivatedRoute, UrlSegment } from '@angular/router';
import * as PostActions from '../post/post.actions';

@Component({
  selector: 'app-page-main',
  templateUrl: './page-main.component.html',
  styleUrls: ['./page-main.component.scss']
})
export class PageMainComponent implements OnInit {
  mode = -1;  // 0 = feed, 1 = my posts, 2 = all posts, 3 = viewing profile, 4 = post

  
  loadedProfile : User|null = null;

  @ViewChild('matMenuTrigger') profileMenu: MatMenuTrigger;

  loggedIn: boolean = false;
  loggedInAccount : User|null = null;
  loggedInUser$: Observable<User|null> = this.store.select(state=> {
    
    this.loggedInAccount = ((state as any)['auth']).loggedInUser;
    console.log("logged in account", this.loggedInAccount)
    let li = !!(this.loggedInAccount);
    if(li && this.loggedIn==false) this.calcRoute();
    this.loggedIn=li;
    if(this.loggedIn==false && this.mode!=3 && this.mode!=4) this.mode=2;
    //console.log("MAIN PAGE, loggedInAccount:",this.loggedInAccount);
    if(this.loggedIn) this.calcRoute();
    return this.loggedInAccount;
  });

  constructor(
    private authService: UserService,
    private store: Store<State>,
    private router: Router,
    private route: ActivatedRoute) {
      //console.log("COOOCCCCCCCCCCCCCCCC");
      this.loggedInAccount = this.authService.getLoggedUser() ?? null;
      this.loggedIn = !!(this.loggedInAccount);
    }

    goProfileBadge(){
      this.profileMenu.openMenu();//.openMenu();
    }
    goLogin(){
      this.router.navigate(['/login']);
    }

    goProfile(userId:string|null){
      userId??=this.loggedInAccount?.id!;
      if(userId)
        this.router.navigate(['/user'],{ queryParams:{id:userId}});
      else this.router.navigate(['/login']);
    }
    goLogout(){
      this.authService.logout();
      this.router.navigate(['/']);
    }
    goFeed():any{
      if(this.loggedIn==false) return this.router.navigate(['/login']);
      if(this.mode!=0)
        this.router.navigate(['/'],{ queryParams:{v:0}})//.then(()=>{ this.mode = 0;});
    }
    goMyPosts():any{
      if(this.loggedIn==false) return this.router.navigate(['/login']);
      
      if(this.mode!=1)
        this.router.navigate(['/'],{ queryParams:{v:1}})//.then(()=>{ this.mode = 1;});
    }
    goAllPosts():any{
      if(this.mode!=2)
        this.router.navigate(['/'],{ queryParams:{v:2}})//.then(()=>{ this.mode = 2;});
    }
    doLoadProfile(usr:User){
      this.loadedProfile = usr;
    }

    calcRoute(url?:string){
      console.log("calc route ",url);
      let path = '';
      if(url===undefined){
        url = window.location.pathname;
        const path2 = this.route.snapshot.queryParamMap.get('v');
        if(path2!==undefined && path2!==null){
          path=path2;
        }else path = url;
      }

        if(url!.startsWith('/?v=0')) path='0';
        else if(url!.startsWith('/?v=1')) path='1';
        else if(url!.startsWith('/?v=2')) path='2';
        else if(url!.startsWith('/?v=3')) path='3';
        else if(url!.startsWith('/user')) path='3';
        else if(url!.startsWith('/post')) path='4';
   //   }
   
   //if((path==''||path=='/')&&this.loggedIn==false){
   // this.router.navigate(['/'],{ queryParams:{v:0}})//.then(()=>{ this.mode = 2;});
   // return;
   //}
      if(path==''||path=='/'||path=='0') this.mode = 0;
      else{
        if(path =='user'||path=='3') this.mode = 3;
        //else console.log(segments);
        else if(path=='1') this.mode=1;
        else if(path=='2') this.mode=2;
        else if(path=='3') this.mode=3;
        else if(path=='4') this.mode=4;
      }
      if(this.loggedIn==false && this.mode!=3&&this.mode!=4) this.mode=2;
      if(this.mode==-1)this.mode=0;
    }
    ngOnInit(): void {
      //console.log("MAIN PAGE INIT",this.loggedInAccount);
      this.store.dispatch(PostActions.clearPostCache());
      this.calcRoute();
      this.router.events.subscribe(e=>{
          if((e as any).url!==undefined)
            this.calcRoute((e as any).url as any);
      })

    }
}
