import { GetStaticProps } from "next";
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import {Container, Row, Col, Table} from 'react-bootstrap';

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
										<li key={episode.id}>
											<Image 
											src={episode.thumbnail}
											alt={episode.title}
											width={192}
											height={192}
											quality={100}
											objectFit="cover"
											/>

											<div className={styles.episodeDetails}>

											<Link href={`/episodes/${episode.id}`}>
												<a >{episode.title}</a>
											</Link>

											<p>{episode.members}</p>
											<span>{episode.publishedAt}</span>
											<span>{episode.durationAsString}</span>
											</div>

											<button type="button" onClick={() => playList(episodeList, index)}>
											<Image 
												src="/play-green.svg" 
												alt="Tocar episódio"
												width={5}
												height={5}
											/>
											</button>
										</li>  
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
						<Table responsive="sm">
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
							{allEpisodes.map((episode, index) => {
								return(
									<tr key={episode.id}>

										<td style={{width: 72}}>
										<Image 
											src={episode.thumbnail}
											alt={episode.title}
											width={120}
											height={120}
											quality={100}
											objectFit="cover"
										/>
										</td>

										<td>
										<Link href={`/episodes/${episode.id}`}>
											<a>{episode.title}</a>
										</Link>
										</td>

										<td>{episode.members}</td>
										<td style={{width: 100}}>{episode.publishedAt}</td>
										<td>{episode.durationAsString}</td>

										<td>
										<button type="button" onClick={() => playList(episodeList, index + latestEpisodes.length)}>
											<Image 
											src="/play-green.svg" 
											alt="Tocar episódio"
											width={25}
											height={25}
											/>
										</button>
										</td>

									</tr>
								)
							})}
							</tbody>
						</Table>
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
