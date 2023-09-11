/**
 * Build styles
 */
import './index.css';

export default class Paragraph {

    static get isReadOnlySupported() {
        return true;
    }
    
    constructor({data, config, api, readOnly}) {
        
        this.api = api;
        this.config = config;
        this.readOnly = readOnly;
        
        this._CSS = {
            block: this.api.styles.block,
            wrapper: 'ce-paragraph',
            alignment: {
                left: 'ce-paragraph--left',
                center: 'ce-paragraph--center',
                right: 'ce-paragraph--right',
                justify: 'ce-paragraph--justify',
            },
            shift: {
                indent: 'ce-paragraph--indent',
                alinea: 'ce-paragraph--alinea'
            }
        }

        this.CSS = {
            baseClass: this.api.styles.block,
            loading: this.api.styles.loader,
            input: this.api.styles.input,
            settingsButton: this.api.styles.settingsButton,
            settingsButtonActive: this.api.styles.settingsButtonActive,
        }

        this.defaultAlignment = "left";
        this.alignmentSettings = [
            {
                name: 'left',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" viewBox="0 0 64 64" width="20" height="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 23h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m10 45h28c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>`
            },
            {
                name: 'center',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" viewBox="0 0 64 64" width="20" height="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 23c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m46 45c1.104 0 2-.896 2-2s-.896-2-2-2h-28c-1.104 0-2 .896-2 2s.896 2 2 2z"/></svg>`
            },
            {
                name: 'right',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" viewBox="0 0 64 64" width="20" height="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 19h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"/><path d="m54 41h-28c-1.104 0-2 .896-2 2s.896 2 2 2h28c1.104 0 2-.896 2-2s-.896-2-2-2z"/></svg>`
            },
            {
                name: 'justify',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 64 64" viewBox="0 0 64 64" width="20" height="20"><path d="m54 8h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="m54 52h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="M 52.867 19 L 10.914 19 C 9.26 19 7.918 19.896 7.918 21 C 7.918 22.104 9.26 23 10.914 23 L 52.867 23 C 54.522 23 55.863 22.104 55.863 21 C 55.863 19.896 54.522 19 52.867 19 Z" style=""></path><path d="m54 30h-44c-1.104 0-2 .896-2 2s.896 2 2 2h44c1.104 0 2-.896 2-2s-.896-2-2-2z"></path><path d="M 52.779 41 L 11.113 41 C 9.469 41 8.136 41.896 8.136 43 C 8.136 44.104 9.469 45 11.113 45 L 52.779 45 C 54.421 45 55.754 44.104 55.754 43 C 55.754 41.896 54.421 41 52.779 41 Z" style=""></path></svg>`
            }
        ];

        this.tabSpace = 8;
        this.maxShift = 5;
        this.shiftSettings = [
            {
                name: 'indent-up',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.666667 26.666667" width="20" height="20" class="shift-stroke"><path d="M 24.309914,3.073293 H 12.501297 c -0.296289,0 -0.536755,0.3942958 -0.536755,0.8801245 0,0.4858287 0.240466,0.8801245 0.536755,0.8801245 h 11.808617 c 0.296289,0 0.536755,-0.3942958 0.536755,-0.8801245 0,-0.4858287 -0.240466,-0.8801245 -0.536755,-0.8801245 z" /><path d="M 10.636897,23.510353 V 3.9288249 c 0,-0.4913183 -0.394296,-0.8900692 -0.8801248,-0.8900692 -0.485829,0 -0.8801248,0.3987509 -0.8801248,0.8900692 V 23.510353 c 0,0.491318 0.3942958,0.890069 0.8801248,0.890069 0.4858288,0 0.8801248,-0.398751 0.8801248,-0.890069 z" /><path d="M 24.309914,22.436032 H 12.501297 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880125 0,0.485829 0.240466,0.880124 0.536755,0.880124 h 11.808617 c 0.296289,0 0.536755,-0.394295 0.536755,-0.880124 0,-0.485829 -0.240466,-0.880125 -0.536755,-0.880125 z" /><path d="m 12.501297,9.6742265 h 7.514575 c 0.296288,0 0.536755,-0.394296 0.536755,-0.880124 0,-0.485829 -0.240467,-0.880125 -0.536755,-0.880125 h -7.514575 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880125 0,0.485828 0.240466,0.880124 0.536755,0.880124 z" /><path d="m 1.742668,14.487329 h 5.249797 c 0.2170704,0 0.3932436,-0.394295 0.3932436,-0.880124 0,-0.485829 -0.1761732,-0.880125 -0.3932436,-0.880125 H 1.7537819 c -0.2170704,0 -0.6599762,0.394296 -0.6599762,0.880125 0,0.485829 0.4317919,0.880124 0.6488623,0.880124 z" /><path d="M 24.309914,12.754663 H 12.501297 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880124 0,0.485829 0.240466,0.880125 0.536755,0.880125 h 11.808617 c 0.296289,0 0.536755,-0.394296 0.536755,-0.880125 0,-0.485828 -0.240466,-0.880124 -0.536755,-0.880124 z" /><path d="m 12.501297,19.355597 h 7.514575 c 0.296288,0 0.536755,-0.394296 0.536755,-0.880125 0,-0.485828 -0.240467,-0.880124 -0.536755,-0.880124 h -7.514575 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880124 0,0.485829 0.240466,0.880125 0.536755,0.880125 z" /><path d="m 4.1998042,11.733053 2.8369623,2.576236 c 0.078376,0.07116 0.5109096,0.0056 0.7857074,-0.309546 0.2753315,-0.315742 0.1134559,-0.780209 -0.033097,-0.920818 l -2.5765632,-2.47205 c -0.076386,-0.07329 -0.5213439,-0.01511 -0.7976412,0.298709 -0.2762979,0.313816 -0.2937367,0.756304 -0.2153686,0.82747 z" /><path d="m 4.1938728,15.377581 2.8369621,-2.576237 c 0.078376,-0.07116 0.5094095,-0.0043 0.7857074,0.309547 0.2762909,0.313822 0.1231884,0.885425 0.045188,0.956991 L 5.206882,16.503758 C 5.128881,16.575326 4.6855385,16.518866 4.4092407,16.205049 4.132943,15.891233 4.1155043,15.448745 4.1938722,15.37758 Z" /></svg>`
            },
            {
                name: 'indent-down',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.666667 26.666667" width="20" height="20" class="shift-stroke"><path d="M 24.309914,3.073293 H 12.501297 c -0.296289,0 -0.536755,0.3942958 -0.536755,0.8801245 0,0.4858287 0.240466,0.8801245 0.536755,0.8801245 h 11.808617 c 0.296289,0 0.536755,-0.3942958 0.536755,-0.8801245 0,-0.4858287 -0.240466,-0.8801245 -0.536755,-0.8801245 z" /><path d="M 10.636897,23.510353 V 3.9288249 c 0,-0.4913183 -0.394296,-0.8900692 -0.8801248,-0.8900692 -0.485829,0 -0.8801248,0.3987509 -0.8801248,0.8900692 V 23.510353 c 0,0.491318 0.3942958,0.890069 0.8801248,0.890069 0.4858288,0 0.8801248,-0.398751 0.8801248,-0.890069 z" /><path d="M 24.309914,22.436032 H 12.501297 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880125 0,0.485829 0.240466,0.880124 0.536755,0.880124 h 11.808617 c 0.296289,0 0.536755,-0.394295 0.536755,-0.880124 0,-0.485829 -0.240466,-0.880125 -0.536755,-0.880125 z" /><path d="m 12.501297,9.6742265 h 7.514575 c 0.296288,0 0.536755,-0.394296 0.536755,-0.880124 0,-0.485829 -0.240467,-0.880125 -0.536755,-0.880125 h -7.514575 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880125 0,0.485828 0.240466,0.880124 0.536755,0.880124 z" /><path d="M 7.326022,14.487329 H 2.076225 c -0.2170704,0 -0.3932436,-0.394295 -0.3932436,-0.880124 0,-0.485829 0.1761732,-0.880125 0.3932436,-0.880125 h 5.2386831 c 0.2170704,0 0.6599762,0.394296 0.6599762,0.880125 0,0.485829 -0.4317919,0.880124 -0.6488623,0.880124 z" /><path d="M 24.309914,12.754663 H 12.501297 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880124 0,0.485829 0.240466,0.880125 0.536755,0.880125 h 11.808617 c 0.296289,0 0.536755,-0.394296 0.536755,-0.880125 0,-0.485828 -0.240466,-0.880124 -0.536755,-0.880124 z" /><path d="m 12.501297,19.355597 h 7.514575 c 0.296288,0 0.536755,-0.394296 0.536755,-0.880125 0,-0.485828 -0.240467,-0.880124 -0.536755,-0.880124 h -7.514575 c -0.296289,0 -0.536755,0.394296 -0.536755,0.880124 0,0.485829 0.240466,0.880125 0.536755,0.880125 z" /><path d="m 4.8688858,11.733053 -2.8369623,2.576236 c -0.078376,0.07116 -0.5109096,0.0056 -0.7857074,-0.309546 -0.27533153,-0.315742 -0.1134559,-0.780209 0.033097,-0.920818 l 2.5765632,-2.47205 c 0.076386,-0.07329 0.5213439,-0.01511 0.7976412,0.298709 0.2762979,0.313816 0.2937367,0.756304 0.2153686,0.82747 z" /><path d="M 4.8748172,15.377581 2.0378551,12.801344 c -0.078376,-0.07116 -0.5094095,-0.0043 -0.7857074,0.309547 -0.27629093,0.313822 -0.1231884,0.885425 -0.045188,0.956991 l 2.6548483,2.435876 c 0.078001,0.07157 0.5213435,0.01511 0.7976413,-0.298709 0.2762977,-0.313816 0.2937364,-0.756304 0.2153685,-0.827469 z" /></svg>`
            },
            {
                name: 'alinea-up',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.666667 26.666667" width="20" height="20" class="shift-stroke"><path d="M 24.309914,3.073293 H 12.501297 c -0.296289,0 -0.536755,0.3942958 -0.536755,0.8801245 0,0.4858287 0.240466,0.8801245 0.536755,0.8801245 h 11.808617 c 0.296289,0 0.536755,-0.3942958 0.536755,-0.8801245 0,-0.4858287 -0.240466,-0.8801245 -0.536755,-0.8801245 z" /><path d="M 24.184985,22.436032 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880125 0,0.485829 0.2964341,0.880124 0.661684,0.880124 H 24.184985 c 0.36525,0 0.661684,-0.394295 0.661684,-0.880124 0,-0.485829 -0.296434,-0.880125 -0.661684,-0.880125 z" /><path d="M 9.6279276,9.6742265 H 18.89151 c 0.365249,0 0.661684,-0.394296 0.661684,-0.880124 0,-0.485829 -0.296435,-0.880125 -0.661684,-0.880125 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880125 0,0.485828 0.2964341,0.880124 0.661684,0.880124 z" /><path d="m 2.1654337,5.1336377 h 5.249797 c 0.2170704,0 0.3932436,-0.394295 0.3932436,-0.880124 0,-0.485829 -0.1761732,-0.880125 -0.3932436,-0.880125 H 2.1765476 c -0.2170704,0 -0.6599762,0.394296 -0.6599762,0.880125 0,0.485829 0.4317919,0.880124 0.6488623,0.880124 z" /><path d="M 24.184985,12.754663 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880124 0,0.485829 0.2964341,0.880125 0.661684,0.880125 H 24.184985 c 0.36525,0 0.661684,-0.394296 0.661684,-0.880125 0,-0.485828 -0.296434,-0.880124 -0.661684,-0.880124 z" /><path d="M 9.6279276,19.355597 H 18.89151 c 0.365249,0 0.661684,-0.394296 0.661684,-0.880125 0,-0.485828 -0.296435,-0.880124 -0.661684,-0.880124 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880124 0,0.485829 0.2964341,0.880125 0.661684,0.880125 z" /><path d="m 4.6225699,2.3793617 2.8369623,2.576236 c 0.078376,0.07116 0.5109096,0.0056 0.7857074,-0.309546 0.2753315,-0.315742 0.1134559,-0.780209 -0.033097,-0.920818 l -2.5765632,-2.47205 c -0.076386,-0.07329 -0.5213439,-0.01511 -0.7976412,0.298709 -0.2762979,0.313816 -0.2937367,0.756304 -0.2153686,0.82747 z" /><path d="m 4.6166385,6.0238897 2.8369621,-2.576237 c 0.078376,-0.07116 0.5094095,-0.0043 0.7857074,0.309547 0.2762909,0.313822 0.1231884,0.885425 0.045188,0.956991 L 5.6296477,7.1500667 C 5.5516467,7.2216367 5.1083042,7.1651767 4.8320064,6.8513577 4.5557087,6.5375417 4.53827,6.0950537 4.6166379,6.0238887 Z" /><path d="m 10.743066,5.3290595 -0.0071,-2.4655286 C 10.726366,2.5352572 10.34877,2.3839571 9.8629409,2.3839571 c -0.485829,0 -0.8801248,0.133137 -0.8801248,0.4970206 v 2.4749664 c 0,0.3028202 0.3942958,0.4792166 0.8801248,0.4792166 0.4858291,0 0.8806341,-0.2043544 0.8801251,-0.5061012 z" /></svg>`
            },
            {
                name: 'alinea-down',
                icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26.666667 26.666667" width="20" height="20" class="shift-stroke"><path d="M 24.309914,3.073293 H 12.501297 c -0.296289,0 -0.536755,0.3942958 -0.536755,0.8801245 0,0.4858287 0.240466,0.8801245 0.536755,0.8801245 h 11.808617 c 0.296289,0 0.536755,-0.3942958 0.536755,-0.8801245 0,-0.4858287 -0.240466,-0.8801245 -0.536755,-0.8801245 z" /><path d="m 10.636897,5.378649 -0.0071,-2.4655286 c -0.0096,-0.3282737 -0.387196,-0.4795738 -0.8730248,-0.4795738 -0.485829,0 -0.8801248,0.133137 -0.8801248,0.4970206 v 2.4749664 c 0,0.3028202 0.3942958,0.4792166 0.8801248,0.4792166 0.4858288,0 0.8806338,-0.2043544 0.8801248,-0.5061012 z" /><path d="M 24.184985,22.436032 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880125 0,0.485829 0.2964341,0.880124 0.661684,0.880124 H 24.184985 c 0.36525,0 0.661684,-0.394295 0.661684,-0.880124 0,-0.485829 -0.296434,-0.880125 -0.661684,-0.880125 z" /><path d="M 9.6279276,9.6742265 H 18.89151 c 0.365249,0 0.661684,-0.394296 0.661684,-0.880124 0,-0.485829 -0.296435,-0.880125 -0.661684,-0.880125 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880125 0,0.485828 0.2964341,0.880124 0.661684,0.880124 z" /><path d="m 7.7487877,5.1336377 h -5.249797 c -0.2170704,0 -0.3932436,-0.394295 -0.3932436,-0.880124 0,-0.485829 0.1761732,-0.880125 0.3932436,-0.880125 h 5.2386831 c 0.2170704,0 0.6599762,0.394296 0.6599762,0.880125 0,0.485829 -0.4317919,0.880124 -0.6488623,0.880124 z" /><path d="M 24.184985,12.754663 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880124 0,0.485829 0.2964341,0.880125 0.661684,0.880125 H 24.184985 c 0.36525,0 0.661684,-0.394296 0.661684,-0.880125 0,-0.485828 -0.296434,-0.880124 -0.661684,-0.880124 z" /><path d="M 9.6279276,19.355597 H 18.89151 c 0.365249,0 0.661684,-0.394296 0.661684,-0.880125 0,-0.485828 -0.296435,-0.880124 -0.661684,-0.880124 H 9.6279276 c -0.3652499,0 -0.661684,0.394296 -0.661684,0.880124 0,0.485829 0.2964341,0.880125 0.661684,0.880125 z" /><path d="m 5.2916515,2.3793617 -2.8369623,2.576236 c -0.078376,0.07116 -0.5109096,0.0056 -0.7857074,-0.309546 -0.2753315,-0.315742 -0.1134559,-0.780209 0.033097,-0.920818 l 2.5765632,-2.47205 c 0.076386,-0.07329 0.5213439,-0.01511 0.7976412,0.298709 0.2762979,0.313816 0.2937367,0.756304 0.2153686,0.82747 z" /><path d="M 5.2975829,6.0238897 2.4606208,3.4476527 c -0.078376,-0.07116 -0.5094095,-0.0043 -0.7857074,0.309547 -0.2762909,0.313822 -0.1231884,0.885425 -0.045188,0.956991 l 2.6548483,2.435876 c 0.078001,0.07157 0.5213435,0.01511 0.7976413,-0.298709 0.2762977,-0.313816 0.2937364,-0.756304 0.2153685,-0.827469 z" /></svg>`
            }
        ];

        this.onKeyUp = this.onKeyUp.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onMouseSelection = this.onMouseSelection.bind(this);
        this.onFocusIn = this.onFocusIn.bind(this);
        this.onFocusOut = this.onFocusOut.bind(this);

        this._placeholder = config.placeholder ? config.placeholder : "";

        this.lastSelection = {};
        this.lastKeyDownEvent = undefined;

        this._data = {
            text: data.text || '',
            alignment: data.alignment || config.defaultAlignment || this.defaultAlignment,
            shift: data.shift || { alinea: 0, indent: 0}
        };

        this._element = this.drawView();
        this.data = data;
        this._preserveBlank = config.preserveBlank !== undefined ? config.preserveBlank : false;
    }

    /**
     * Icon and title for displaying at the Toolbox
     *
     * @return {{icon: string, title: string}}
     */
    static get toolbox() {
        return {
            icon: '<svg xmlns="http://www.w3.org/2000/svg" style="color:transparent; height:12px; width:17px;" viewBox="0.2 -0.3 9 11.4" width="12" height="14"><path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"/></svg>',
            title: 'Text',
        };
    }

    onMouseSelection(e) {

        if (e instanceof KeyboardEvent && e.key === 'Tab') return;
        this.lastSelection = this.getCurrentSelection();
    }

    getCurrentTextSelection()
    {
        return this.getTextFromSelection(this.getSelectionFromRange(this.getCurrentRange()));   
    }

    getTextFromSelection(selection)
    {
        if(selection         == undefined) return "";
        if(selection.element == undefined) return "";
        return selection.element.textContent.substring(selection.start, selection.start+selection.length);
    }

    getTextFromRange(range)
    {
        return this.getTextFromSelection(this.getSelectionFromRange(range));
    }

    getRangeFromElement = (element, positionA, positionB = -1) => {
        
        var rangeA = document.createRange();
        if(positionB < 0) {

            if (element.nodeType === Node.TEXT_NODE) {

                rangeA.setStart(element, positionA);
                rangeA.setEnd(element, positionA);
                
                return rangeA;
            }

            for (let child of element.childNodes) {
                
                if (positionA <= child.textContent.length)
                    return this.getRangeFromElement(child, positionA);

                positionA -= child.textContent.length;
            }

            return rangeA;

        } 
        
        var rangeB = this.getRangeFromElement(element, positionB);

        rangeA = this.getRangeFromElement(element, positionA);
        rangeA.setEnd(rangeB.endContainer, rangeB.endOffset);

        return rangeA;
    };

    findIndexInAncestor(el, ancestor)
    {
        if(el == ancestor) return -1;
        if(el == null) return -1;

        while( el.parentNode != ancestor ) {

            el = el.parentNode;
            if(el == null) return -1;
        } 

        return Array.prototype.indexOf.call(ancestor.childNodes, el);
    }

    findOffsetInAncestor(el, ancestor)
    {
        var offset = 0;

        while( el.parentNode != ancestor ) {

            el = el.parentNode;
            if(el == null) return -1;
        } 

        return offset;
    }

    createRangeFromSelection(selection)
    {
        var range = undefined;
        if(selection == undefined) range = this.getCurrentRange();
        else range = this.getRangeFromElement(this._element, selection.start, selection.start + selection.length);

        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);

        this.lastSelection = this.getSelectionFromRange(range);
        return range;
    }

    getCurrentRange()
    {
        if(window.getSelection().rangeCount < 1)
            return document.createRange();

        var range = window.getSelection().getRangeAt(0);
        return range;
    }

    getCurrentSelection()
    {
        return this.getSelectionFromRange(this.getCurrentRange());
    }

    getSelectionFromRange(range)
    {
        var start = 0;
        var end   = 0;

        var ancestorRange = document.createRange();
            ancestorRange.setStart(this._element, 0);
        
        ancestorRange.setEnd(range.startContainer, range.startOffset);
        start = ancestorRange.toString().length;

        ancestorRange.setEnd(range.endContainer, range.endOffset);
        end = ancestorRange.toString().length;

        return { start: start, length: (end-start), index: this.api.blocks.getCurrentBlockIndex(), element: this._element };
    }

    replaceSelectionWith(html, selection, selectPastedContent = false) {

        var node = document.createElement("span");
            node.innerHTML = html;

        var range = this.createRangeFromSelection(selection);
            range.deleteContents();
            range.insertNode(node);

        if(selectPastedContent) selection.length = html.textContent;
        else selection.length = 0;

        this.createRangeFromSelection(selection);
    }

    eraseSelection(selection) { this.replaceSelectionWith("", selection); }
    eraseAtCaret(text)
    {
        var selection = this.getCurrentSelection();
            selection.length = 1;
    
        while(this.getTextFromSelection(selection).startsWith(" ")) {
            selection.start += 1;
        }

        selection.length = text.trim().length;
        if (this.getTextFromSelection(selection) == text)
            this.replaceSelectionWith("", selection);
    }

    insertAtCaret(html, selectPastedContent = false) {

        if(html == "") return;
        this.replaceSelectionWith(html, this.getCurrentSelection(), selectPastedContent);
    }

    onKeyUp(e) {

        if (e.code !== 'Backspace' && e.code !== 'Delete') {
            return;
        }

        const {textContent} = this._element;

        if (textContent === '') {
            this._element.innerHTML = '';
        }

        this.lastKeyDownEvent = undefined;
    }


    onKeyDown(e) {

        // Prevent from opening inliner tool or changing paragraph
        if (e.key === "Tab") {

            this.lastKeyDownEvent = e;
            e.stopPropagation();

            if(e.shiftKey) {

                var shiftOffset = 0;
                while(shiftOffset <= this.tabSpace) { 

                    var selection = this.getCurrentSelection();
                        selection.start = Math.max(selection.start - shiftOffset++, 0);
                        selection.length = this.tabSpace;

                    var selectedText = this.getTextFromSelection(selection);
                        selectedText = selectedText.replaceAll(String.fromCharCode(32), String.fromCharCode(160));
                    
                    if (selectedText == String.fromCharCode(160).repeat(this.tabSpace)) {
                    
                        this.eraseSelection(selection);

                        selection.length = 0;
                        this.createRangeFromSelection(selection);
                        break;
                    }
                }

            } else {

                this.insertAtCaret(String.fromCharCode(160).repeat(this.tabSpace));
                var selection = this.getCurrentSelection();
                    selection.start += this.tabSpace;

                this.createRangeFromSelection(selection);
            }
        }
    }

    onFocusIn() { }
    
    onFocusOut() {

        // If tab is pressed the browser tries to change focus.. 
        // so we intercept that and move it back to the proper place
        if(this.lastKeyDownEvent != undefined) {

            this.createRangeFromSelection(this.lastSelection); // Keep the previously selected range..
            this.lastKeyDownEvent = undefined;
        }
    }

    /**
     * Create Tool's view
     * @return {HTMLElement}
     * @private
     */
    drawView() {

        let div = document.createElement('DIV');

            div.classList.add(
                this._CSS.wrapper, this._CSS.block, 
                this._CSS.alignment[this.data.alignment]
            );

            div.contentEditable = !this.readOnly;
            div.dataset.placeholder = this.api.i18n.t(this._placeholder);

            div.dataset.alinea = parseInt(this.data.shift.alinea);
            if(div.dataset.alinea) div.classList.add(this._CSS.shift.alinea);
            
            div.dataset.indent = parseInt(this.data.shift.indent);
            if(div.dataset.indent) div.classList.add(this._CSS.shift.indent);
            
            div.innerHTML = this.data.text;
            
            div.addEventListener('keydown', this.onKeyDown);
            div.addEventListener('keyup', this.onKeyUp);

            div.addEventListener("keyup", this.onMouseSelection);
            div.addEventListener("mouseup", this.onMouseSelection);
            div.addEventListener("mousedown", this.onMouseSelection);
            
            div.addEventListener("focusin", this.onFocusIn);
            div.addEventListener("focusout", this.onFocusOut);

        return div;
    }
 
    /**
     * Return Tool's view
     * @returns {HTMLDivElement}
     * @public
     */
    render() {
        return this._element;
    }

    /**
     * Method that specified how to merge two Text blocks.
     * Called by Editor.js by backspace at the beginning of the Block
     * @param {ParagraphData} data
     * @public
     */
    merge(data) {

        var selection = this.getCurrentSelection();
            selection.length = selection.start;
            selection.start = 0;

        let newData = {
            text: this.getTextFromSelection(selection) + data.text,
            alignment: this.data.alignment,
            shift: {
                alinea:this.data.shift.alinea,
                indent:this.data.shift.indent
            }
        };

        var selection = this.getCurrentSelection();

        this._element.innerHTML = this.data.text;
        setTimeout(() => this.createRangeFromSelection(selection), 0);
        
        this.data = newData;
    }

    /**
     * Validate Paragraph block data:
     * - check for emptiness
     *
     * @param {ParagraphData} data — data received after saving
     * @returns {boolean} false if saved data is not correct, otherwise true
     * @public
     */
    validate(data) {
        return data.text.trim() !== '' || this._preserveBlank;
    }

    /**
     * Extract Tool's data from the view
     * @param {HTMLDivElement} toolsContent - Paragraph tools rendered view
     * @returns {ParagraphData} - saved data
     * @public
     */
    save(toolsContent) {
        return Object.assign(this.data, {
            text: toolsContent.innerHTML,
        });
    }

    /**
     * On paste callback fired from Editor.
     *
     * @param {PasteEvent} event - event with pasted data
     */
    onPaste(event) {
        const data = {
            text: event.detail.data.innerHTML,
            alignment: this.config.defaultAlignment || this.defaultAlignment,
            shift: {
                alinea:0,
                indent:0
            }
        };

        this.data = data;
    }

    /**
     * Get current Tools`s data
     * @returns {ParagraphData} Current data
     * @private
     */
    get data() {
        return this._data;
    }

    /**
     * Store data in plugin:
     * - at the this._data property
     * - at the HTML
     *
     * @param {ParagraphData} data — data to set
     * @private
     */
    set data(data) {
        this._data = {
            text: data.text || '',
            alignment: data.alignment || this.config.defaultAlignment || this.defaultAlignment,
            shift: data.shift || {alinea:0, indent:0}
        }
        this._element.innerHTML = this._data.text || '';
    }


    /**
     * Enable Conversion Toolbar. Paragraph can be converted to/from other tools
     */
    static get conversionConfig() {
        return {
            export: 'text', // to convert Paragraph to other block, use 'text' property of saved data
            import: 'text' // to convert other block's exported string to Paragraph, fill 'text' property of tool data
        };
    }

    /**
     * Sanitizer rules
     */
    static get sanitize() {

        return {
            text: {
                br: true
            },
            alignment: {},
            shift: {
                alinea: {},
                indent: {},
            }
        };
    }

    /**
     * Used by Editor paste handling API.
     * Provides configuration to handle P tags.
     *
     * @returns {{tags: string[]}}
     */
    static get pasteConfig() {
        return {
            tags: ['P']
        };
    }

    /**
     *
     * @returns {HTMLDivElement}
     */
    renderSettings() {

        const wrapper = document.createElement('div');

        this.alignmentSettings.map(tune => {
            
            const button = document.createElement('div');
                  button.classList.add('cdx-settings-button');
                  button.innerHTML = tune.icon;

            button.classList.toggle(this.CSS.settingsButtonActive, tune.name === this.data.alignment);

            wrapper.appendChild(button);

            return button;

        }).forEach((element, index, elements) => {

            element.addEventListener('click', () => {

                this.data.alignment = this.alignmentSettings[index].name;

                elements.forEach((el, i) => {
                    const {name} = this.alignmentSettings[i];
                    el.classList.toggle(this.CSS.settingsButtonActive, name === this.data.alignment);
                    this._element.classList.toggle(this._CSS.alignment[name], name === this.data.alignment)
                });
            });
        });

        wrapper.appendChild(document.createElement('div'));

        this.shiftSettings.map(tune => {

            const button = document.createElement('div');
                  button.classList.add('cdx-settings-button');
                  button.innerHTML = tune.icon;

            wrapper.appendChild(button);

            return button;

        }).forEach((element, index, elements) => {

            element.addEventListener('click', () => {

                var prefixName = this.shiftSettings[index].name;
                var shiftName = prefixName.replace(/\-(up|down)$/, "");
                var addShift  = prefixName.endsWith("-up");

                this._element.dataset.alinea = this._element.dataset.alinea || 0;
                var alineaEnabled = (this._element.dataset.alinea > 0 && !addShift) || (this._element.dataset.alinea < this.maxShift && addShift);
                if(shiftName == "alinea" && alineaEnabled) {
                    this._element.dataset.alinea = parseInt(this._element.dataset.alinea) + (addShift ? 1 : -1);
                    this._element.classList.toggle(this._CSS.shift[shiftName], this._element.dataset.alinea != 0);
                    this.data.shift.alinea = parseInt(this._element.dataset.alinea);
                }

                this._element.dataset.indent = this._element.dataset.indent || 0;
                var indentEnabled = (this._element.dataset.indent > 0 && !addShift) || (this._element.dataset.indent < this.maxShift && addShift);
                if(shiftName == "indent" && indentEnabled) {
                    this._element.dataset.indent = parseInt(this._element.dataset.indent) + (addShift ? 1 : -1);
                    this._element.classList.toggle(this._CSS.shift[shiftName], this._element.dataset.indent != 0);
                    this.data.shift.indent = parseInt(this._element.dataset.indent);
                }
            });
        });

        return wrapper;
    }
}
