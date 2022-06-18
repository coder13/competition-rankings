import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material';
import { Header } from './Header';

function LayoutComponent() {
  return (
    <div>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default LayoutComponent;
