// ANGULAR
import {ActivatedRoute} from "@angular/router";
import {Component, OnInit} from '@angular/core';
// RXJS
import {BehaviorSubject, Subscription} from "rxjs";
// SERVICES
import {CharacterDetailsService} from "./character-details.service";
// OTHERS
import {ROUTE_TRANSITION} from '../../app.animation';

@Component({
  selector: 'elastic-project-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: {'[@routeTransition]': ''}
})

export class CharacterDetailsComponent implements OnInit {

  character = new BehaviorSubject<any>(null);
  subs: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private characterDetailsService: CharacterDetailsService) {
  }

  ngOnInit():any {

    const id = this.activatedRoute.snapshot.params.id;
    this.characterDetailsService.getCharacterById(id).subscribe(res => {
      this.character.next(res.body);
    });

  }

  ngOnDestroy():any {
    this.subs?.unsubscribe();
  }

}
