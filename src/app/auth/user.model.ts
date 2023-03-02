export class User {
  constructor(public email: string,
              public id: string,
              private _token: string,
              private _tokenExpiresAt: Date) {
  }

  get token() {
    if (!this._tokenExpiresAt || this._tokenExpiresAt < new Date()){
      return null;
    }
    return this._token;
  }

  get tokenExpiresAt(): Date {
    return this._tokenExpiresAt;
  }
}
