import styled from 'styled-components';

const Card = styled.section`
  background: var(--surface);
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 18px;
  box-shadow: var(--shadow);
  padding: 24px;
  display: grid;
  gap: 14px;
  max-width: 860px;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 2.8vw, 2.4rem);
`;

const Copy = styled.p`
  color: var(--text-main);
  line-height: 1.6;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  display: grid;
  gap: 8px;
  color: var(--text-muted);
`;

export const AboutPage = () => {
  return (
    <Card>
      <Title>About This Project</Title>
      <Copy>
        This gallery is built with React and TypeScript, using styled-components for UI composition and react-router
        for multi-page navigation. It showcases image browsing with searchable metadata, sorting, persisted
        multi-select, and downloadable assets.
      </Copy>
      <List>
        <li>Custom data hook that handles loading, error, and empty states</li>
        <li>Global selection context that persists while navigating between routes</li>
        <li>Client-side pagination for large datasets</li>
        <li>Mobile-to-desktop responsive layout with 1/2/4 column breakpoints</li>
      </List>
    </Card>
  );
};
