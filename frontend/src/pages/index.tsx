import Head from 'next/head';
import Link from 'next/link';

import {
    Container,
    Header,
    Content,
    StyledLink,
    CallToAction,
} from '../styles/pages/home';

export default function Home() {

    return (
        <Container>
            <Head>
                <title>Zero Chat</title>
            </Head>

            <Header>
                <h1>Zero</h1>

                <div>
                    <Link href='/signin'>
                        <StyledLink>SignIn</StyledLink>
                    </Link>
                    <Link href='/signup'>
                        <StyledLink>SignUp</StyledLink>
                    </Link>
                </div>
            </Header>

            <Content>
                <h1>Zero</h1>
                <h2>A realtime chat made for you!</h2>

                <Link href='/signup'>
                    <CallToAction>Start now!</CallToAction>
                </Link>
            </Content>
        </Container>
    );
};
