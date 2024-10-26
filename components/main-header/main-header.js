import Link from "next/link";
import logoImg from '@/assets/logo.png'
import classes from './main-header.module.css'
import Image from "next/image";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";

export default function MainHeader() {

    return <header className={classes.header}>
        <Link href='/' className={classes.logo}>
           <Image src={logoImg} priority/>
           Foodies
        </Link>

        <nav className={classes.nav}>
            <ul>
                <li>
                    <NavLink href='/meals'>Explore Meals</NavLink>
                </li>
                <li>
                    <NavLink href='/community'>Community</NavLink>
                </li>
            </ul>
        </nav>
    </header>;
}