export class concello {
  concello: string;
  email: string;
  email2?: string;
  extra?: string;

  constructor(
    concello: string,
    email: string,
    email2?: string,
    extra?: string
  ) {
    this.concello = concello;
    this.email = email;
    this.email2 = email2;
    this.extra = extra;
  }
}
