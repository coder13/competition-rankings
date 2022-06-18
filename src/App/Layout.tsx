import { Link, Outlet } from 'react-router-dom';
import routes from 'Routes';

function LayoutComponent() {
  return (
    <div>
      <div>
        Menu
        <ul>
          <li>
            <Link to={routes.home}>Home</Link>
          </li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default LayoutComponent;
