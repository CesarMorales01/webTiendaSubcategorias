import { Link } from '@inertiajs/react';
import { info } from 'autoprefixer';

export default function NavLink({ active = false, info, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            style={{ color: info.color_letra_navbar!='' ? info.color_letra_navbar : 'black', fontSize: '1.05em', marginLeft: '1.1em' }}
            className={
                'inline-flex'
            }
        >
            {children}
        </Link>
    );
}

