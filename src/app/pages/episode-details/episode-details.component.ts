// ANGULAR
import {ActivatedRoute} from "@angular/router";
import {Component, OnDestroy, OnInit} from '@angular/core';
// RXJS
import {BehaviorSubject, Subscription} from "rxjs";
// SERVICES
import {EpisodeDetailsService} from "./episode-details.service";
// OTHERS
import {ROUTE_TRANSITION} from '../../app.animation';

@Component({
  templateUrl: './episode-details.component.html',
  styleUrls: ['./episode-details.component.scss'],
  animations: [...ROUTE_TRANSITION],
  host: {'[@routeTransition]': ''}
})

export class EpisodeDetailsComponent implements OnInit, OnDestroy {

  episode = new BehaviorSubject<any>(null);
  subs: Subscription;

  constructor(private activatedRoute: ActivatedRoute,
              private episodeDetailsService: EpisodeDetailsService) {

  }

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.params.id;
    this.subs = this.episodeDetailsService.getEpisodeById(id).subscribe(res => this.episode.next(res.body));
  }

  ngOnDestroy(): void {
    this.subs?.unsubscribe();
  }

}
