import 'react';

declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'model-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                src?: string;
                'ios-src'?: string;
                poster?: string;
                alt?: string;
                'shadow-intensity'?: string | number;
                'camera-controls'?: boolean | string;
                'auto-rotate'?: boolean | string;
                ar?: boolean | string;
                'ar-modes'?: string;
                'ar-placement'?: string;
                'ar-scale'?: string;
                'camera-orbit'?: string;
                exposure?: string | number;
                'environment-image'?: string;
                loading?: string;
                reveal?: string;
                style?: React.CSSProperties;
                id?: string;
                ref?: React.RefObject<any>;
            };
        }
    }
}
