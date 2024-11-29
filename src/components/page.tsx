import React, { ComponentPropsWithoutRef, useEffect, useState } from 'react';
import tailwindMerge from './../utils/tailwind-merge';
import { createPortal } from 'react-dom';

const FOOTER_OUTLET_NAME = 'page-footer-outlet';

function Header({ children, className, ...remaining }: React.PropsWithChildren<ComponentPropsWithoutRef<'div'>>) {
    return (
        <div className={tailwindMerge('static sm:sticky top-0 z-10', className)} {...remaining}>
            {children}
        </div>
    );
}

function Content({ children, className, ...remaining }: React.PropsWithChildren<ComponentPropsWithoutRef<'div'>>) {
    return (
        <div className={tailwindMerge('flex-grow', className)} {...remaining}>
            { children }
        </div>
    );
}

export type FooterOutletProps = Pick<ComponentPropsWithoutRef<'div'>, 'className'>;

export const FooterOutlet = React.forwardRef<HTMLDivElement, FooterOutletProps>((props, ref) => {
    return <div id={FOOTER_OUTLET_NAME} ref={ref} {...props} data-outlet></div>;
});
FooterOutlet.displayName = 'FooterOutlet';

function Footer({ children, className, ...remaining }: React.PropsWithChildren<ComponentPropsWithoutRef<'div'>>) {
    return (
        <div className={tailwindMerge('sticky bottom-0 shadow-top-line-plus-shadow', className)} {...remaining}>
            { children }
        </div>
    );
}

/**
 * Children can use this component to insert content into the footer without having to use the top-level
 * <Page.Footer> component.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function FooterContent({ children }: React.PropsWithChildren<{}>) {
    const [isOutletReady, setOutletReady] = useState(false);

    useEffect(() => {
        const outlet = document.getElementById(FOOTER_OUTLET_NAME);

        if (outlet !== null) {
            setOutletReady(true);
        }
    }, []);

    if (!isOutletReady) {
        return <></>;
    }

    if (children === undefined) {
        return <></>;
    }

    return createPortal(
        children,
        document.getElementById(FOOTER_OUTLET_NAME)!,
    );
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
function PageBase({ children }: React.PropsWithChildren<{}>) {
    return (
        <div className="flex flex-col min-h-screen">
            {children}
        </div>
    );
}

const Page = Object.assign(PageBase, { Content, Footer, Header, displayName: 'Page' });

/**
 * A component that owns the layout of a page. It supports a sticky header and footer, as well as scrollable content.
 *
 * Note that the <Page> component was designed specifically to operate with the <Page.Header>, <Page.Content> and <Page.Footer> components.
 *
 */
export default Page;
