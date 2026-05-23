import { Link } from 'react-router-dom';
import styled from 'styled-components';
import type { Pet } from '../types';
import { formatDate } from '../utils/format';

interface PetCardProps {
  pet: Pet;
  selected: boolean;
  onToggle: (id: string) => void;
}

const Card = styled.article`
  background: var(--surface);
  border: 1px solid rgba(31, 45, 36, 0.1);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
  min-height: 100%;
`;

const ImageWrap = styled.div`
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: rgba(15, 118, 110, 0.09);
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.04);
  }
`;

const Content = styled.div`
  padding: 14px;
  display: grid;
  gap: 10px;
  align-content: start;
  flex: 1;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
`;

const Title = styled.h3`
  font-size: 1.15rem;
`;

const Meta = styled.div`
  color: var(--text-muted);
  font-size: 0.88rem;
`;

const Description = styled.p`
  color: var(--text-muted);
  line-height: 1.45;
  font-size: 0.95rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const CardFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 0.92rem;
  color: var(--text-muted);
`;

const DetailLink = styled(Link)`
  color: var(--brand-strong);
  font-weight: 700;
`;

export const PetCard = ({ pet, selected, onToggle }: PetCardProps) => {
  return (
    <Card>
      <ImageWrap>
        <Thumbnail src={pet.imageUrl} alt={pet.title} loading="lazy" />
      </ImageWrap>
      <Content>
        <TopRow>
          <Title>{pet.title}</Title>
          <Meta>{formatDate(pet.createdAt)}</Meta>
        </TopRow>
        <Description>{pet.description}</Description>
        <CardFooter>
          <CheckboxLabel>
            <input type="checkbox" checked={selected} onChange={() => onToggle(pet.id)} />
            Select
          </CheckboxLabel>
          <DetailLink to={`/pets/${encodeURIComponent(pet.id)}`}>Open</DetailLink>
        </CardFooter>
      </Content>
    </Card>
  );
};
