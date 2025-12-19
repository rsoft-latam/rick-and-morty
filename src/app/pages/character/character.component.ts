// ANGULAR
import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
// RXJS
import {BehaviorSubject, Subscription} from "rxjs";
// NGRX
import * as fromRoot from '../../reducers/index';
import {Store} from "@ngrx/store";
// SERVICES
import {CharacterService} from "./character.service";
// OTHERS
import {ROUTE_TRANSITION} from '../../app.animation';

@Component({
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: {'[@routeTransition]': ''}
})

export class CharacterComponent implements OnInit, OnDestroy {

  desktopWidth = `0 0 calc(33.3333% - 24px)`;
  tabletWidth = `0 0 calc(33.3333% - 24px)`;
  smallTabletWidth = `0 0 calc(50% - 24px)`;
  mobileWidth = `0 0 calc(100% - 24px)`;

  filter = 'all';

  items = new BehaviorSubject<any[]>([]);
  subs: Subscription;

  constructor(private store: Store<fromRoot.State>,
              private cd: ChangeDetectorRef,
              private rickAndMortyService: CharacterService) {

    this.rickAndMortyService.currentFilter().subscribe(res => {
      this.subs = this.rickAndMortyService.getCharacters(res).subscribe(
        res => this.items.next(res.body.results)
      ); 
    });

  }

  onFilter(event):any {
    const aux = this.rickAndMortyService.getFilter();
    aux.page = 1;
    aux.species = event.value === 'all' ? null : event.value;
    this.rickAndMortyService.sendFilter(aux);
  }

  ngOnInit():any {
  }


  ngOnDestroy():any {
    
  }

  previous():any {
    const aux = this.rickAndMortyService.getFilter();
    aux.page = aux.page - 1
    aux.page > 0 ? this.rickAndMortyService.sendFilter(aux) : '';
  }

  next():any {
    const aux = this.rickAndMortyService.getFilter();
    aux.page = aux.page + 1
    this.rickAndMortyService.sendFilter(aux);
  }

}
