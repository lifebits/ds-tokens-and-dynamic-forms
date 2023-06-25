class ConfigThemeManager {
  public autoPrefix: string = 'isp';
}

class HSLColor {
  hue!: number;
  saturation!: number;
  lightness!: number;
  constructor(hslString: string) {
    // @ts-ignore
    const [hue, saturation, lightness] = hslString.match(/\d+/g).map(Number);
    Object.assign(this, { hue, saturation, lightness })
  }
  getBasisValue(): string {
    return `${this.hue}deg, ${this.saturation}%`;
  }
  getLightnessFromHSL(): string {
    return `${this.lightness}%`;
  }
}

export class TokenManager {
  #config: ConfigThemeManager = this.config
    ? { ...new ConfigThemeManager(), ...this.config }
    : new ConfigThemeManager();

  #varsCache: any = this.getRootVars();
  varsCacheProxy: any = this.getVarCashProxy(this.#config);

  static normalizeVariableName(name = '', config: ConfigThemeManager): string {
    // console.log('NORMAL', name, name.substring(0, 2) !== '--');
    if (name.substring(0, 2) !== '--') {
      return `--${config.autoPrefix}-${name}`;
    }
    return name;
  }

  static getHSLObject(hslStr: string): any {
    // @ts-ignore
    const [hue, saturation, lightness] = hslStr.match(/\d+/g).map(Number);
    return { hue, saturation, lightness };
  }

  static getBasisValueFromHSL(hslColor: HSLColor): string {
    return `${hslColor.hue}deg, ${hslColor.saturation}%`;
  }

  static getLightnessFromHSL(hslColor: HSLColor): string {
    return `${hslColor.lightness}%`;
  }

  constructor(private config: ConfigThemeManager = new ConfigThemeManager()) {}

  getRootVars(): any {
    return Array.from(document.styleSheets)
      .reduce((acc: any[], sheet: CSSStyleSheet) => {
        // console.log('SHEET', sheet);
        const cssRules = Array.from(sheet.cssRules).reduce((def: any[], rule: any) => {
          return rule.selectorText !== ':root'
            ? def
            : [
                ...def,
                ...Array.from(rule.style).filter((name: any) => name.startsWith('--' + this.#config.autoPrefix)),
              ]; // TODO fix starWith parameter
        }, []);
        // console.log('Check', cssRules);
        return [...acc, cssRules];
      }, [])
      .flat()
      .map((data) => {
        // console.log(111, data);
        return data;
      })
      .reduce((def: any, string: string) => {
        const normalizeName = string.replace(`--${this.#config.autoPrefix}-`, '');
        def[normalizeName] = getComputedStyle(document.documentElement).getPropertyValue(string).trim();
        return def;
      }, {});
    // .map((string: string) => string.replace(`--${this.#config.autoPrefix}-`, ''))
  }

  getVarCashProxy(config: ConfigThemeManager): any {
    return new Proxy(this.#varsCache, {
      get(target: any, p: string | symbol, receiver: any): any {
        // console.log('GET', { target, p });
        return Reflect.get(target, p);
      },
      set(target: any, p: string | symbol, newValue: any, receiver: any): boolean {
        const name = TokenManager.normalizeVariableName(p as string, config);
        const tokenBasisName = `${name}-basis`;
        const tokenBasisValue = new HSLColor(newValue).getBasisValue();
        const tokenLightnessName = `${name}-lightness`;
        const tokenLightnessValue = new HSLColor(newValue).getLightnessFromHSL();
        // newValue = String(newValue);
        document.documentElement.style.setProperty(tokenBasisName, tokenBasisValue);
        document.documentElement.style.setProperty(tokenLightnessName, tokenLightnessValue);
        console.log('SET', { target, p, newValue });
        return Reflect.set(target, name, newValue);
      },
    });
  }
}
