import { useContext, useEffect, useRef } from 'react';
import { PlayerContext } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Slider from 'rc-slider';

import 'rc-slider/assets/index.css';
import es from 'date-fns/esm/locale/es/index.js';

export function Player()
{
    const audioRef = useRef<HTMLAudioElement>(null);

    const { episodeList, currentEpisodeIndex, isPlaying, togglePlay, setPlayingState } = useContext(PlayerContext);
    const episode = episodeList[currentEpisodeIndex];

    useEffect(() => {
        if(!audioRef.current)
        {
            return;
        }

        if(isPlaying)
        {
            audioRef.current.play();
        }
        else
        {
            audioRef.current.pause();
        }
    }, [isPlaying]);

    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando agora"/>
                <strong>Tocando agora</strong>
            </header>

            { episode ? (
                <div className={styles.currentEpisode}>
                    <div style={{backgroundImage: `url(${episode.thumbnail})`}} />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>
            ) : (
                <div className={styles.emptyPlayer}>
                    <strong>Selecione um podcast para ouvir</strong>
                </div>
            )}
            
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>00:00</span>
                    <div className={styles.slider}>
                        { episode ? (
                            <Slider 
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }} 
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }} 
                            />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}
                    </div>
                    <span>00:00</span>
                </div>

                { episode && (
                    <audio
                        src={episode.file.url} 
                        ref={audioRef} 
                        autoPlay
                        onPlay={() => setPlayingState(true)}
                        onPause={() => setPlayingState(false)} 
                    />
                )}

                <div className={styles.buttons}>
                    <button type="button" disabled={!episode}>
                        <img src="/shuffle.svg" alt="Embaralhar"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-previous.svg" alt="Tocar anterior"/>
                    </button>
                    <button
                        type="button"
                        className={styles.playButton}
                        disabled={!episode}
                        onClick={togglePlay}
                    >
                        <img src={isPlaying ? "pause.svg" : "/play.svg" } alt="Tocar"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/play-next.svg" alt="Tocar próxima"/>
                    </button>
                    <button type="button" disabled={!episode}>
                        <img src="/repeat.svg" alt="repetir"/>
                    </button>
                </div>
            </footer>
        </div>
    );
}