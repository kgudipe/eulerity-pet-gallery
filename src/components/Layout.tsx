import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { useSelection } from '../context/SelectionContext';

const Shell = styled.div`
  min-height: 100vh;
`;

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(10px);
  background: rgba(243, 247, 237, 0.84);
  border-bottom: 1px solid rgba(31, 45, 36, 0.12);
`;

const HeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
`;

const Brand = styled(NavLink)`
  font-family: 'Fraunces', serif;
  font-size: 1.2rem;
  font-weight: 600;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StyledNavLink = styled(NavLink)`
  padding: 8px 12px;
  border-radius: 999px;
  color: var(--text-muted);
  font-weight: 500;

  &.active {
    background: var(--surface-strong);
    color: var(--brand-strong);
    box-shadow: var(--shadow);
  }
`;

const SelectionBadge = styled.div`
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(15, 118, 110, 0.13);
  color: var(--brand-strong);
  font-weight: 600;
  font-size: 0.9rem;
`;

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

export const Layout = () => {
  const { selectedCount } = useSelection();

  return (
    <Shell>
      <Header>
        <HeaderInner>
          <Brand to="/">Pet Atlas</Brand>
          <Nav>
            <StyledNavLink to="/" end>
              Gallery
            </StyledNavLink>
            <StyledNavLink to="/about">About</StyledNavLink>
            <SelectionBadge>{selectedCount} selected</SelectionBadge>
          </Nav>
        </HeaderInner>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </Shell>
  );
};
