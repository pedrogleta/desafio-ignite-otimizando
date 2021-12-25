import { useCallback, useEffect, useState } from 'react';

import { SideBar } from './components/SideBar';
import { Content } from './components/Content';

import { api } from './services/api';

import './styles/global.scss';

import './styles/sidebar.scss';
import './styles/content.scss';

export interface IApiGenre {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

export interface IGenre extends Omit<IApiGenre, 'id'> {
  id: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

function apiGenreToGenre(apiGenre: IApiGenre): IGenre {
  return {
    id: String(apiGenre.id),
    name: apiGenre.name,
    title: apiGenre.title,
  };
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState('1');

  const [genres, setGenres] = useState<IGenre[]>([]);

  const [movies, setMovies] = useState<MovieProps[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<IGenre | null>(null);

  useEffect(() => {
    api.get<IApiGenre[]>('genres').then((response) => {
      setGenres(response.data.map(apiGenreToGenre));
    });
  }, []);

  useEffect(() => {
    api
      .get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`)
      .then((response) => {
        setMovies(response.data);
      });

    api.get<IApiGenre>(`genres/${selectedGenreId}`).then((response) => {
      setSelectedGenre(apiGenreToGenre(response.data));
    });
  }, [selectedGenreId]);

  const handleClickButton = useCallback((id: string) => {
    setSelectedGenreId(id);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <SideBar
        genres={genres}
        selectedGenreId={selectedGenreId}
        buttonClickCallback={handleClickButton}
      />

      {selectedGenre && (
        <Content selectedGenre={selectedGenre} movies={movies} />
      )}
    </div>
  );
}
