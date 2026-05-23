import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Card = styled.section`
  background: var(--surface);
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 28px;
  display: grid;
  gap: 12px;
  text-align: center;
`;

const HomeLink = styled(Link)`
  justify-self: center;
  padding: 8px 12px;
  border: 1px solid rgba(31, 45, 36, 0.2);
  border-radius: 10px;
  background: var(--surface-strong);
  font-weight: 600;
`;

export const NotFoundPage = () => {
  return (
    <Card>
      <h1>Page not found</h1>
      <p>The route you requested does not exist.</p>
      <HomeLink to="/">Go to gallery</HomeLink>
    </Card>
  );
};
