import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import Image from "next/image";
import {Container} from 'react-bootstrap';

import styles from './styles.module.scss';

export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    });

    return(

        <Container>

        <header className={styles.headerContainer}>
            {/* <img src="/logo.svg" alt="Podcast"/> */}
            <Image
                src="/logo.svg" 
                alt="Podcast"
                width={135}
                height={135}
            />

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>
        </header>
                    
        </Container>
    );
}