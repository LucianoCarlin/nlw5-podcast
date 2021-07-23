import Image from "next/image";
import { useRef, useEffect, useState } from 'react';
import Slider, { Handle } from 'rc-slider';
import 'rc-slider/assets/index.css';
import {Container, Row, Col, Table} from 'react-bootstrap';

import { usePlayer } from '../../contexts/PlayerContext';

import styles from './styles.module.scss';


/* import playing from "../../../public/playing.svg"; */
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';



export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);

    const {
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        isLooping,
        isShuffling,
        togglePlay,
        toggleLoop, 
        toggleShuffle,
        setPlayingState, 
        playNext, 
        playPrevious,
        hasNext,
        hasPrevious,   
        clearPlayerState,    
    } = usePlayer()

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }

        if (isPlaying) {
            audioRef.current.play();
        } else {
            audioRef.current.pause()
        }
    }, [isPlaying]) 

    function setupProgressListener(){
        audioRef.current.currentTime = 0;
        audioRef.current.addEventListener('timeupdate', () => {
            setProgress(Math.floor(audioRef.current.currentTime));
        });
    }

    function handleSeek(amount: number){
        audioRef.current.currentTime = amount;
        setProgress(amount);
    }

    function handleEpisodeEnded() {
        if (hasNext) {
            playNext()
        } else {
            clearPlayerState()    
        }
    }

    const episode = episodeList[currentEpisodeIndex];

    return(
        <section>
            <Container>
                <Row>
                    <div className={styles.playerContainer}>
                        <header>
                                {/* <img src="/playing.svg" alt="Tocando agora" /> */}
                                <Image
                                    src="/playing.svg" 
                                    alt="Tocando agora"
                                    width={50}
                                    height={100}
                                />
                                {/* <strong>Tocando agora {episode?.title}</strong> */}
                                <strong>Tocando agora</strong>
                        </header>

                        {episode ? (
                            <div className={styles.currentEpisode}>

                                <Image
                                    width={592}
                                    height={592}
                                    src={episode.thumbnail}
                                    alt=""
                                    objectFit="cover"
                                />

                                <strong>{episode.title}</strong>
                                <span>{episode.members}</span>

                            </div>
                        ) : (
                            <div className={styles.emptyPlayer}>
                                <strong>Selecione um podcast para ouvir</strong>                
                            </div>
                        ) }

                        <footer className={!episode ? styles.empty : ''}>
                            <div className={styles.progress}>
                                <span>{convertDurationToTimeString(progress)}</span> 

                                <div className={styles.slider}>
                                    {episode ? (
                                        <Slider
                                            max={episode.duration}
                                            value={progress}
                                            onChange={handleSeek}
                                            trackStyle={{backgroundColor: '#04d361'}}   
                                            railStyle={{backgroundColor: '#9f75ff'}} 
                                            handleStyle={{borderColor: '#04d361', borderWidth: 4}}                           
                                        />   
                                    ) : (
                                        <div className={styles.emptySlider}/>
                                    )}
                                </div>                    

                                <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>    
                            </div>

                            {episode && (
                                <audio
                                    src={episode.url}
                                    ref={audioRef}
                                    loop={isLooping}
                                    autoPlay   
                                    onEnded={handleEpisodeEnded}                     
                                    onPlay={() => setPlayingState(true)}
                                    onPause={() => setPlayingState(false)}
                                    onLoadedMetadata={setupProgressListener}
                                />

                            )}

                            <div className={styles.buttons}>
                                <button 
                                    type="button" 
                                    disabled={!episode || episodeList.length === 1} 
                                    onClick={toggleShuffle} 
                                    className={isShuffling ? styles.isActive : ''}
                                > 
                                    {/* <img src="/shuffle.svg" alt="Embaralhar" /> */}
                                    <Image
                                        src="/shuffle.svg"
                                        alt="Embaralhar"
                                        width={26.5}
                                        height={100}
                                    />
                                </button>

                                <button type="button" onClick={playPrevious} disabled={!episode || !hasPrevious}> 
                                    {/* <img src="/play-previous.svg" alt="Tocar anterior" /> */}
                                    <Image
                                        src="/play-previous.svg"
                                        alt="Tocar anterior"
                                        width={26.5}
                                        height={100}
                                    />
                                </button>

                                <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}> 
                                    {/* <img src="/play.svg" alt="Tocar" /> */}
                                    {isPlaying
                                    ? 
                                        <Image
                                            src="/pause.svg"
                                            alt="Tocar"
                                            width={25}
                                            height={25}
                                        />
                                    : 
                                        <Image
                                            src="/play.svg"
                                            alt="Tocar"
                                            width={25}
                                            height={25}
                                        />
                                    
                                    }
                                    
                                </button>

                                <button type="button" onClick={playNext} disabled={!episode || !hasNext}> 
                                    {/* <img src="/play-next.svg" alt="Tocar próxima" /> */}
                                    <Image
                                        src="/play-next.svg"
                                        alt="Tocar próxima"
                                        width={26.5}
                                        height={100}
                                    />
                                </button>

                                <button type="button" disabled={!episode} onClick={toggleLoop} className={isLooping ? styles.isActive : ''}> 
                                    {/* <img src="/repeat.svg" alt="Repetir" /> */}
                                    <Image
                                        src="/repeat.svg"
                                        alt="Repetir"
                                        width={26.5}
                                        height={100}
                                    />
                                </button>
                            </div>
                        </footer>
                    </div>
                </Row>
            </Container>
        </section>
    );
}