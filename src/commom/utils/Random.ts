export class Random {
  public randomValidationCode(): string {
    return this.randomCode(5);
  }

  public randomSmsCode(): string {
    return this.randomCode(6);
  }

  private randomCode(length: number) {
    if (length > 16 || length <= 0) {
      length = 16;
    }

    const rand = Math.random().toString();
    if (length <= 2) {
      return rand.substring(16 - length, 16);
    }

    return rand.toString().substring(2, length + 2);
  }
}
