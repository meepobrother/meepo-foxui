import { Injectable, InjectionToken, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
declare const window: any;
@Injectable()
export class ApiService {
    that: any;
    header: HttpHeaders = new HttpHeaders();
    onInit: Subject<any> = new Subject();

    options: any = {
        siteUrl: "https://meepo.com.cn",
        baseUrl: "https://meepo.com.cn",
        staticUrl: ""
    };
    constructor(
        public http: HttpClient
    ) {
        this.header.append('Content-Type', 'application/x-www-form-urlencoded');
        this.header.append('Access-Control-Allow-Origin', '*');
        this.header.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
        this.header.append('Content-Type', 'application/json');
        this.header.append('Accept', 'application/json');

        this.init(window['config']);
    }

    init(options: any) {
        this.options = { ...this.options, ...options };
        console.log(this.options);
    }

    toQueryPair(key: string, value: string) {
        if (typeof value === 'undefined') {
            return key;
        }
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    }

    toQueryString(obj: any) {
        let ret: any[] = [];
        for (let key in obj) {
            key = encodeURIComponent(key);
            const values = obj[key];
            if (values && values.constructor === Array) {
                const queryValues = [];
                for (let i = 0, len = values.length, value; i < len; i++) {
                    value = values[i];
                    queryValues.push(this.toQueryPair(key, value));
                }
                ret = ret.concat(queryValues);
            } else {
                ret.push(this.toQueryPair(key, values));
            }
        }
        return ret.join('&');
    }

    getUrl(routes: any, params: any, full: boolean = false) {
        routes = routes.replace(/\//ig, ".");
        let url;
        if (params.m) {
            url = `${this.options.siteroot}app/index.php?c=entry&i=${this.options.uniacid}&do=${routes}`;
        } else {
            url = `${this.options.siteroot}app/index.php?c=entry&i=${this.options.uniacid}&do=${routes}&m=imeepos_runnerpro`;
        }
        if (params) {
            if (typeof (params) === 'object') {
                url += "&" + this.toQueryString(params);
            } else if (typeof (params) === 'string') {
                url += "&" + params;
            }
        }
        return url;
    }

    private rad(d: any) {
        return d * Math.PI / 180;
    }

    getNumber(str: string) {
        str = str.trim();
        if (str === '') {
            return 0;
        }
        return parseFloat(str.replace(',', ''));
    }

    getDistanceByLnglat(lng1: any, lat1: any, lng2: any, lat2: any) {
        const rad1 = this.rad(lat1);
        const rad2 = this.rad(lat2);
        const a = rad1 - rad2;
        const b = this.rad(lng1) - this.rad(lng2);
        let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(rad1) * Math.cos(rad2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378137.0;
        s = Math.round(s * 10000) / 10000000;
        return s;
    }

    ish5app() {
        const userAgent: string = navigator.userAgent;
        if (userAgent.indexOf('CK 2.0') > -1) {
            return true;
        }
        return false;
    }

    isWeixin() {
        const ua: string = navigator.userAgent.toLowerCase();
        const isWX: any = '' + ua.match(/MicroMessenger/i) === "micromessenger";
        return isWX;
    }

    post(url: string, post: any): Observable<any> {
        return this.http.post(url, post, { headers: this.header });
    }

    get(url: string): Observable<any> {
        return this.http.get(url, { headers: this.header });
    }

    formatDate(date: Date, fmt: string) {
        const o: any = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (const k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}

