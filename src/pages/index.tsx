import Head from 'next/head';
import Link from 'next/link';

import {
    Container,
    Header,
    Content,
    InitialCard,
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
                        <StyledLink className="signup">SignUp</StyledLink>
                    </Link>
                </div>
            </Header>

            <Content>
                <InitialCard>
                    <h2>A perfect chat for you!</h2>

                    <Link href='/signup'>
                        <CallToAction>Start now!</CallToAction>
                    </Link>
                </InitialCard>
            </Content>
        </Container>
    );
};
