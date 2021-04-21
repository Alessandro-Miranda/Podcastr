import { GetStaticProps } from 'next';
import Link from 'next/link';
import { api } from '../services/api';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString';
import styles from './home.module.scss';

type Episode = {
    id: string;      
    title: string;
    members: string;
    published_at: string;
    thumbnail: string;
    description: string;
    file: {
        url: string;
        type: string;
        duration: number;
        durationAsString: Number;
    }
}
type HomeProps = {
    latestEpisodes: Array<Episode>;
    allEpisodes: Array<Episode>;
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
    return (
        <div className={styles.homepage}>
            <section className={styles.latestEpisodes}>
                <h2>Últimos lançamentos</h2>
                <ul>
                    {latestEpisodes.map(episode => {
                        return (
                            <li key={episode.id}>
                                <img 
                                    src={episode.thumbnail}
                                    alt={episode.title}
                                />

                                <div className={styles.episodeDetails}>
                                    <Link href={`/episodes/${episode.id}`}>
                                        <a>{episode.title}</a>
                                    </Link>
                                    <p>
                                        {episode.members}
                                    </p>
                                    <span>{episode.published_at}</span>
                                    <span>{episode.file.durationAsString}</span>
                                </div>

                                <button type="button">
                                    <img src="/play-green.svg" alt="Tocar episódio"/>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </section>
            <section className={styles.allEpisodes}>
                <h2>Todos episódios</h2>
                <table cellSpacing={0}>
                    <thead>
                        <tr>
                            <th></th>
                            <th>Podcast</th>
                            <th>Integrantes</th>
                            <th>Data</th>
                            <th>Duração</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {allEpisodes.map(episode => {
                            return (
                                <tr key={episode.id}>
                                    <td>
                                        <img
                                            src={episode.thumbnail}
                                            alt={episode.title}
                                        />
                                    </td>
                                    <td>
                                        <Link href={`/episodes/${episode.id}`}>
                                            <a>{episode.title}</a>
                                        </Link>
                                    </td>
                                    <td>{episode.members}</td>
                                    <td style={{width: 100}}>{episode.published_at}</td>
                                    <td>{episode.file.durationAsString}</td>
                                    <td>
                                        <button type="button">
                                            <img src="/play-green.svg" alt="Tocar episódio"/>
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </section>
        </div>
    )
}

/*Forma tradicional de realizar chamadas
    useEffect(() => {
        fetch('http://localhost:3333/episodes')
            .then(response => response.json())
            .then(data => console.log(data))
    }, []);*/

/*chamada a api usando SSR
export async function getServerSideProps()
{
    const response = await fetch('http://localhost:3333/episodes');
    const data = await response.json();

    return {
        props: {
            episodes: data
        }
    }
}*/

// chamada a api usando SSG
export const getStaticProps: GetStaticProps = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
    });

    const episodes = data.map(episode => {
        return {
            ...episode,
            published_at: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
            file: {
                ...episode.file,
                duration: Number(episode.file.duration),
                durationAsString: convertDurationToTimeString(Number(episode.file.duration))
            }
        }
    });

    const latestEpisodes = episodes.slice(0, 2);
    const allEpisodes = episodes.slice(2, episodes.length);

    return {
        props: {
            latestEpisodes,
            allEpisodes
        },
        revalidate: 60 * 60 * 8
    }
}