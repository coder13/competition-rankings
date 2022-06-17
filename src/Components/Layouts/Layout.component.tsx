import { Link, Outlet } from "react-router-dom";
import routes from "Routes";
import styles from "./Layout.module.css";

function LayoutComponent() {
    return (
        <div className={styles.main}>
            <div className={styles.left}>
                Menu
                <ul>
                    <li><Link to={routes.defaultAsFunction}>Page en fonction</Link></li>
                    <li><Link to={routes.defaultAsClass}>Page en classe</Link></li>
                </ul>
            </div>
            <div className={styles.right}><Outlet /></div>
        </div>
    )
}

export default LayoutComponent;