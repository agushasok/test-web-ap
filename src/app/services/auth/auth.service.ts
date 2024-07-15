import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  catchError,
  distinct,
  filter,
  interval,
  map,
  NEVER,
  of,
  shareReplay,
  switchMap,
  take
} from "rxjs";
import { JwtBody, RefreshTokenResponse, User } from "../../models/user.model";
import { environment } from "../../../environments/environment";
import { TelegramService } from "../telegram.service";
import { HttpClient, HttpContext } from "@angular/common/http";
import { HttpContextTokens } from "../../utils/http.constants";
import { mapWith } from "../../utils/observable-helper";

interface SsoToken {
  refreshToken: string;
  jwt?: string;
}

interface UserState {
  ssoToken: SsoToken | null;
  user: User | null;
  isExited: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly accountUrl = environment.clientDataUrl + '/auth/actions';
  private readonly ssoUrl = environment.ssoUrl;
  private readonly ssoTokenStorageKey = 'sso';
  private readonly currentUserSub = new BehaviorSubject<UserState | null>(null);

  readonly currentUser$ = this.currentUserSub.asObservable().pipe(
    map(x => x?.user),
    filter((x): x is User => !!x)
  );

  readonly accessToken$ = this.currentUserSub.pipe(
    switchMap((userState, index) => {
      if (
        userState?.ssoToken?.refreshToken != null
        && !!userState.ssoToken.refreshToken.length
        && (userState.ssoToken.jwt == null || !userState.ssoToken.jwt.length)
      ) {
        // refreshToken is set after login. Need to get jwt
        this.refreshToken(userState);
        return NEVER;
      }
      else if (this.isAuthorised(userState?.ssoToken)) {
        // token is restored. Need to refresh
        if (index === 0) {
          this.refreshToken(userState!);
          return NEVER;
        }
      }
      else {
        // user is not authorized
        this.telegramService.tg.CloudStorage.removeItem(this.ssoTokenStorageKey);
        this.redirectToSso(userState?.isExited ?? false);
        return NEVER;
      }

      return of(userState);
    }),
    mapWith(() => interval(1000), (userState,) => userState),
    switchMap(userState => {
      if (this.isAuthorised(userState?.ssoToken)) {
        return of(userState);
      }

      this.refreshToken(userState!);
      return NEVER;
    }),
    shareReplay(1),
    filter(userState => this.isAuthorised(userState?.ssoToken)),
    map(userState => userState!.ssoToken!.jwt!),
    distinct()
  );

  constructor(
    private readonly telegramService: TelegramService,
    private readonly http: HttpClient
  ) {
    this.telegramService.tg.CloudStorage.getItem(
      this.ssoTokenStorageKey,
      (err: Error | null, token: string) => {
        if (err != null || (token ?? '') === '') {
          return;
        }

        this.setCurrentUser({
          ssoToken: JSON.parse(token ?? 'null') ?? null,
          user: null,
          isExited: false
        });
      });
  }

  setRefreshToken(token: string): void {
    this.setCurrentUser({
      ssoToken: {
        refreshToken: token
      },
      user: null,
      isExited: false
    });
  }

  private refreshToken(userState: UserState): void {
    this.http.post<RefreshTokenResponse>(
        `${this.accountUrl}/refresh`,
        {
          refreshToken: userState.ssoToken?.refreshToken
        },
        {
          context: new HttpContext().set(HttpContextTokens.SkipAuthorization, true)
        }
      ).pipe(
        catchError(() => {
          return of(null);
        }),
        take(1)
      )
      .subscribe(response => {
        if (response) {
          const jwt =  response.jwt;
          const jwtBody = this.decodeJwtBody(jwt);
          const user: User = {
            portfolios: (jwtBody.portfolios as string | undefined)?.split(' ') ?? [],
            clientId: jwtBody.clientid,
            login: jwtBody.sub
          };

          this.telegramService.tg.CloudStorage.setItem(
            this.ssoTokenStorageKey,
            JSON.stringify({
              refreshToken: userState.ssoToken!.refreshToken,
              jwt: jwt
            })
          );

          this.setCurrentUser({
            ...userState,
            ssoToken: {
              ...userState.ssoToken!,
              jwt
            },
            user
          });
        } else {
          this.telegramService.tg.CloudStorage.removeItem(this.ssoTokenStorageKey);
          this.redirectToSso(false);
        }
      });
  }

  private decodeJwtBody(jwt: string): JwtBody {
    const mainPart = jwt.split('.')[1];
    const decodedString = atob(mainPart);
    return JSON.parse(decodedString) as JwtBody;
  }

  private redirectToSso(isExit: boolean): void {
    window.location.assign(this.ssoUrl + `?url=http://${window.location.host}/auth/callback&scope=Astras` + (isExit ? '&exit=1' : ''));
  }

  private setCurrentUser(userState: UserState): void {
    this.currentUserSub.next(userState);
  }

  private isAuthorised(ssoToken?: SsoToken | null): boolean {
    if (ssoToken?.jwt != null && ssoToken.jwt.length > 0) {
      return this.checkTokenTime((ssoToken).jwt);
    }

    return false;
  }

  private checkTokenTime(token: string | undefined): boolean {
    if (token != null && token.length > 0) {
      const expirationTime = this.decodeJwtBody(token).exp * 1000;

      // need to refresh the token before it expires. See https://github.com/alor-broker/Astras-Trading-UI/issues/1367
      const timeReserveMs = 1000 * 5;
      const now = Date.now() + timeReserveMs;
      return now < expirationTime;
    }

    return false;
  }
}
