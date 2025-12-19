import {Component, OnInit} from '@angular/core';
import {SidenavItem} from '../sidenav/sidenav-item/sidenav-item.model';
import * as fromRoot from '../../reducers/index';
import * as fromSidenav from '../sidenav/shared/sidenav.action';
import {SetCurrentlyOpenByRouteAction} from '../sidenav/shared/sidenav.action';
import {Store} from '@ngrx/store';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {SelectLayoutAction, SetCardElevationAction} from '../layout/shared/layout.action';

@Component({
  selector: 'elastic-route-handler',
  template: `
    <router-outlet></router-outlet>
  `
})

export class RouteHandlerComponent implements OnInit {

  constructor(
    private store: Store<fromRoot.State>,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // Set Sidenav Currently Open on Page load
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.store.dispatch(new SetCurrentlyOpenByRouteAction(event.urlAfterRedirects));
      }
    });

    // You can use ?layout=beta to load the page with Layout Beta as default
    // Same with ?elevation=5 (anything from 0 to 24)
    this.route.queryParamMap.subscribe((params) => {
      const layout = params.get('layout');

      switch (layout) {
        case 'alpha': {
          this.store.dispatch(new SelectLayoutAction('alpha'));
          break
        }

        case 'beta': {
          this.store.dispatch(new SelectLayoutAction('beta'));
          break
        }

        case 'gamma': {
          this.store.dispatch(new SelectLayoutAction('gamma'));
          break
        }
      }

      const elevation = params.get('elevation');

      if (elevation) {
        this.store.dispatch(new SetCardElevationAction('card-elevation-z' + elevation))
      }
    });

    // Define Menu Items here

    // Top Level Item (The item to click on so the dropdown opens)
    const dashboard = new SidenavItem({
      name: 'Characters',
      icon: 'dashboard',
      route: '/character',
      position: 1
    });

    // Sub Items for the Top Level Item (The items shown when you clicked on the dropdown item)
    // Note: The Top Level Item is added as "parent" in those items, here "character" (variable from above)

    // Push the just created Sub Items into the Top Level Item

    // Send the created Menu structure to Redux/ngrx (you only need to send the Top Level Item, all dropdown items will be added automatically)
    this.store.dispatch(new fromSidenav.AddSidenavItemAction(dashboard));
  }

}
