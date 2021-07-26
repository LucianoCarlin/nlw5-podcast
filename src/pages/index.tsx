import { GetStaticProps } from "next";
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import {Container, Row, Col, Card} from 'react-bootstrap';

import { convertDurationToTimeString } from "../utils/convertDurationToTimeString";
import { api } from '../services/api';
import { usePlayer } from "../contexts/PlayerContext";

import styles from './home.module.scss';

//SSG

type Episode = {
	id: string;
	title: string;
	members: string;
	publishedAt: string;
	description: string;
	duration: number;
	durationAsString: string;
	url: string;
	thumbnail: string;
}

type HomeProps = {
	latestEpisodes: Episode[];
	allEpisodes: Episode[];
}

export default function Home({latestEpisodes, allEpisodes}: HomeProps) {

	const {playList} = usePlayer()

	const episodeList = [...latestEpisodes, ...allEpisodes];

	return(
		<div className={styles.homepage}>
			<Head>
				<title>Home | Podcast</title>
			</Head>
		
			<section className={styles.latestEpisodes}>
				<Container> 
					<h2>Últimos lançamentos</h2>
					<Row>						
						<ul className={styles.ul}>                         
							{latestEpisodes.map((episode, index) => {                    
								return(
									// eslint-disable-next-line react/jsx-key
									<Col md="6"> 
										<Card className={styles.card}>
											<li key={episode.id}>
												<Card.Img variant="top" src={episode.thumbnail} />
												<Card.Body className={styles.episodeDetails}>
													{/* <div className={styles.episodeDetails}> */}
													<Card.Title></Card.Title>

													<Link href={`/episodes/${episode.id}`}>
														<a >{episode.title}</a>
													</Link>

													<Card.Text>
														<p>{episode.members}</p>
														<span>{episode.publishedAt}</span>
														<span>{episode.durationAsString}</span>
														{/* </div> */}
													</Card.Text>	

													<button type="button" onClick={() => playList(episodeList, index)}>
													<Image 
														src="/play-green.svg" 
														alt="Tocar episódio"
														width={5}
														height={5}
													/>
													</button>
												</Card.Body>
											</li>  
										</Card>	
									</Col>                                                       
								)}                    
							)} 
						</ul>
					</Row> 
				</Container>   
			</section>

			<section className={styles.allEpisodes}>
				<Container>
					<h2>Todos episódios</h2>
					<Row> 					
						{allEpisodes.map((episode, index) => {
							return(	
								<Col sm ="6" md="4" lg="4" xl="3" key={episode.id}> 							
									<Card className={styles.card}>

										<Link href={`/episodes/${episode.id}`}>
											<a><Card.Img variant="top" src={episode.thumbnail} alt={episode.title} /></a>
										</Link>
										<button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
											{/* <Card.Img variant="top" src="/play-green.svg"  alt="Tocar episódio"/> */}
											<Image 
											src="/play-green.svg" 
											alt="Tocar episódio"
											width={25}
											height={25}
											/>
										</button>
										
										<Card.Body >
											{/* <Card.Title></Card.Title>										
											
										 <Card.Text>	
												<p>{episode.members}</p>
												<span>{episode.publishedAt}</span><br></br>
												<span>{episode.durationAsString}</span>
											</Card.Text> 	 */}							
											
										</Card.Body>
									</Card>  
								</Col>
							)
						})}
					</Row>
				</Container>
			</section>
		</div>
	)
}

export const getStaticProps: GetStaticProps = async () => {
  const {data} = await api.get('episodes', {
    params: {
      _limit: 10,
      _sort: 'published_at',
      _order: 'desc' 
    } 
  })

  const episodes = data.map(episode => {
    return{
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };
  })

  const latestEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latestEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8,
  }
}
