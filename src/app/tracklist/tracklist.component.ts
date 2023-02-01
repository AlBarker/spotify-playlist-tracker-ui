import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, shareReplay, Subject } from 'rxjs';

export interface TrackModel {
  name: string;
  artist: string;
  position: number;
  addedByName: string;
  addedByImage: string;
  albumArt: string;
}

@Component({
  selector: 'app-tracklist',
  templateUrl: './tracklist.component.html',
  styleUrls: ['./tracklist.component.scss']
})
export class TracklistComponent {
  public tracks$: Observable<TrackModel[]>;
  public tracksByUser$: Observable<Record<string, number>>;
  public nowPlayingTrack$: Observable<TrackModel | undefined>;
  public noTracksToShow$ = new BehaviorSubject<boolean>(false);
  public error$ = new Subject<string>;
  private apiUrl = 'http://offli-recip-2bnd114i0b3a-1954917878.ap-southeast-2.elb.amazonaws.com/track/'

  constructor(private httpClient: HttpClient) {
    this.tracks$ = this.getTracks().pipe(map((tracks) => { 
      if (tracks.length === 0) {
        this.noTracksToShow$.next(true);
      }
      tracks.shift();
      return tracks
    }),
    catchError((err) => { 
      this.error$.next(err.message);
      return of();
    }));
    this.tracksByUser$ = this.getTracksByUser();
    this.nowPlayingTrack$ = this.getTracks().pipe(map((tracks) => tracks.shift()));
  }



  private getTracks(): Observable<TrackModel[]> {
    return this.httpClient.get<TrackModel[]>(`${this.apiUrl}list`);
  }

  private getTracksByUser(): Observable<Record<string, number>> {
    return this.httpClient.get<Record<string, number>>(`${this.apiUrl}usersummary`).pipe(shareReplay(1));
  }

  getHeadImage(fileName: string) {
    return `/assets/images/${fileName}.png`;
  }

  getAlbumArt(fileName: string) {
    return `${fileName}`;
  }
}
