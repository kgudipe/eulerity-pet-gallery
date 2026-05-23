import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { usePets } from '../context/PetsContext';
import { useSelection } from '../context/SelectionContext';
import { fileNameFromPet, formatDate } from '../utils/format';

const Wrapper = styled.section`
  display: grid;
  gap: 16px;
`;

const BackLink = styled(Link)`
  width: fit-content;
  color: var(--brand-strong);
  font-weight: 600;
`;

const Card = styled.article`
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 18px;
  box-shadow: var(--shadow);
  background: var(--surface);
  padding: 16px;

  @media (min-width: 900px) {
    grid-template-columns: 1.3fr 1fr;
    padding: 22px;
  }
`;

const Image = styled.img`
  width: 100%;
  max-height: 70vh;
  object-fit: cover;
  border-radius: 14px;
  background: rgba(15, 118, 110, 0.08);
`;

const Content = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: clamp(1.8rem, 3vw, 2.5rem);
`;

const Meta = styled.p`
  color: var(--text-muted);
  font-weight: 500;
`;

const Description = styled.p`
  color: var(--text-main);
  line-height: 1.55;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
`;

const Button = styled.button`
  border: 1px solid rgba(31, 45, 36, 0.2);
  background: var(--surface-strong);
  padding: 10px 12px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const PrimaryButton = styled(Button)`
  background: var(--brand);
  border-color: var(--brand);
  color: #fff;
`;

const StateCard = styled.section`
  border: 1px solid rgba(31, 45, 36, 0.12);
  border-radius: 16px;
  box-shadow: var(--shadow);
  background: var(--surface);
  padding: 24px;
  text-align: center;
  display: grid;
  gap: 10px;
`;

const downloadImage = async (imageUrl: string, fileName: string): Promise<void> => {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image (${response.status})`);
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = objectUrl;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(objectUrl);
};

export const PetDetailPage = () => {
  const { id: rawId } = useParams<{ id: string }>();
  const id = rawId ? decodeURIComponent(rawId) : '';

  const { petsById, status, error, refetch } = usePets();
  const { isSelected, toggleSelection } = useSelection();

  if (status === 'loading') {
    return (
      <StateCard>
        <h2>Loading pet details...</h2>
      </StateCard>
    );
  }

  if (status === 'error') {
    return (
      <StateCard>
        <h2>Unable to load pet details</h2>
        <p>{error ?? 'Unexpected error while loading /pets.'}</p>
        <Button onClick={refetch}>Try again</Button>
      </StateCard>
    );
  }

  const pet = petsById[id];

  if (!pet) {
    return (
      <StateCard>
        <h2>Pet not found</h2>
        <p>The requested pet id does not exist in the current dataset.</p>
        <BackLink to="/">Back to gallery</BackLink>
      </StateCard>
    );
  }

  const selected = isSelected(pet.id);

  return (
    <Wrapper>
      <BackLink to="/">← Back to gallery</BackLink>
      <Card>
        <Image src={pet.imageUrl} alt={pet.title} />
        <Content>
          <Title>{pet.title}</Title>
          <Meta>Created: {formatDate(pet.createdAt)}</Meta>
          <Description>{pet.description}</Description>
          <Controls>
            <Button onClick={() => toggleSelection(pet.id)}>
              {selected ? 'Remove from Selection' : 'Add to Selection'}
            </Button>
            <PrimaryButton
              onClick={() => {
                void downloadImage(pet.imageUrl, fileNameFromPet(pet.title, pet.id, pet.imageUrl));
              }}
            >
              Download Image
            </PrimaryButton>
          </Controls>
        </Content>
      </Card>
    </Wrapper>
  );
};
