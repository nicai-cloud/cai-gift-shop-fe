import lottie from 'lottie-web';
import { ComponentPropsWithoutRef, useEffect, useRef } from 'react';

import tailwindMerge from '../../utils/tailwind-merge';

const data = { nm: 'Main Scene', ddd: 0, h: 300, w: 300, meta: { g: '@lottiefiles/creator 1.30.0' }, layers: [{ ty: 4, nm: 'Camada de forma 2', sr: 1, st: 0, op: 141, ip: 0, hd: false, ddd: 0, bm: 0, hasMask: false, ao: 0, ks: { a: { a: 0, k: [-14.604, -15.104, 0] }, s: { a: 0, k: [100, 100, 100] }, sk: { a: 0, k: 0 }, p: { a: 0, k: [150, 150, 0] }, r: { a: 1, k: [{ o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 }, s: [0], t: 0 }, { s: [1080], t: 180 }] }, sa: { a: 0, k: 0 }, o: { a: 0, k: 100 } }, shapes: [{ ty: 'gr', bm: 0, hd: false, mn: 'ADBE Vector Group', nm: 'Elipse 1', ix: 1, cix: 2, np: 3, it: [{ ty: 'el', bm: 0, hd: false, mn: 'ADBE Vector Shape - Ellipse', nm: 'Caminho da elipse 1', d: 1, p: { a: 0, k: [0, 0] }, s: { a: 0, k: [106.793, 106.793] } }, { ty: 'st', bm: 0, hd: false, mn: 'ADBE Vector Graphic - Stroke', nm: 'TraÃ§ado 1', lc: 2, lj: 1, ml: 4, o: { a: 0, k: 100 }, w: { a: 0, k: 16 }, c: { a: 0, k: [0.3216, 0.0784, 0.8627] } }, { ty: 'tr', a: { a: 0, k: [5, -53] }, s: { a: 0, k: [100, 100] }, sk: { a: 0, k: 0 }, p: { a: 0, k: [-9.604, -68.104] }, r: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }, { ty: 'tm', bm: 0, hd: false, mn: 'ADBE Vector Filter - Trim', nm: 'Aparar caminhos 1', ix: 2, e: { a: 1, k: [{ o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 }, s: [3], t: 0 }, { o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 }, s: [70], t: 68 }, { s: [70], t: 127 }] }, o: { a: 0, k: 0 }, s: { a: 1, k: [{ o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 }, s: [0], t: 0 }, { o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 }, s: [0], t: 68 }, { s: [67], t: 127 }] }, m: 1 }], ind: 1 }, { ty: 4, nm: 'Camada de forma 1', sr: 1, st: 0, op: 141, ip: 0, hd: false, ddd: 0, bm: 0, hasMask: false, ao: 0, ks: { a: { a: 0, k: [-14.604, -15.104, 0] }, s: { a: 0, k: [100, 100, 100] }, sk: { a: 0, k: 0 }, p: { a: 0, k: [150, 150, 0] }, r: { a: 1, k: [{ o: { x: 0.167, y: 0.167 }, i: { x: 0.833, y: 0.833 }, s: [0], t: 0 }, { s: [1080], t: 180 }] }, sa: { a: 0, k: 0 }, o: { a: 0, k: 100 } }, shapes: [{ ty: 'gr', bm: 0, hd: false, mn: 'ADBE Vector Group', nm: 'Elipse 1', ix: 1, cix: 2, np: 3, it: [{ ty: 'el', bm: 0, hd: false, mn: 'ADBE Vector Shape - Ellipse', nm: 'Caminho da elipse 1', d: 1, p: { a: 0, k: [0, 0] }, s: { a: 0, k: [106.793, 106.793] } }, { ty: 'st', bm: 0, hd: false, mn: 'ADBE Vector Graphic - Stroke', nm: 'TraÃ§ado 1', lc: 2, lj: 1, ml: 4, o: { a: 0, k: 100 }, w: { a: 0, k: 16 }, c: { a: 0, k: [0.898, 0.898, 0.898] } }, { ty: 'tr', a: { a: 0, k: [5, -53] }, s: { a: 0, k: [100, 100] }, sk: { a: 0, k: 0 }, p: { a: 0, k: [-9.604, -68.104] }, r: { a: 0, k: 0 }, sa: { a: 0, k: 0 }, o: { a: 0, k: 100 } }] }], ind: 2 }], v: '5.7.0', fr: 60, op: 141, ip: 0, assets: [] };

export type LoadingSpinnerProps = Pick<ComponentPropsWithoutRef<'div'>, 'className'>;

export default function InitialLoadingSpinner({ className }: LoadingSpinnerProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: ref.current!,
            animationData: data,
        });

        return () => {
            animation.destroy();
        };
    }, []);

    return <div ref={ref} className={tailwindMerge('size-6', className)}></div>;
}
