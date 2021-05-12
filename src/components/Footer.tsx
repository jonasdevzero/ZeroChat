import Link from 'next/link'
import {
    Container,
    LogoContainer,
    Content,
    StyledLink,
    Credits
} from '../styles/components/Footer'
import HeartIcon from '@material-ui/icons/Favorite'

export default function Footer() {
    return (
        <Container>
            <LogoContainer>
                <img src="/logo.svg" alt="" />
                <h5>A Modern Web Chat</h5>
            </LogoContainer>

            <hr />

            <Content>
                <div>
                    <h6>Explore</h6>

                    <Link href='/'>
                        <StyledLink>Home</StyledLink>
                    </Link>
                    <Link href='/signin'>
                        <StyledLink>Log In</StyledLink>
                    </Link>
                    <Link href='/signup'>
                        <StyledLink>Sign Up</StyledLink>
                    </Link>
                    <Link href='/'>
                        <StyledLink>FAQ</StyledLink>
                    </Link>
                </div>
                <div>
                    <h6>Social</h6>

                    <StyledLink href='https://github.com/jonasdevzero' rel="noopener noreferrer external nofollow" target="_blank">
                        GitHub
                    </StyledLink>

                    <StyledLink href='https://www.linkedin.com/in/jonasdevzero/' rel="noopener noreferrer external nofollow" target="_blank">
                        LinkedIn
                    </StyledLink>

                    <StyledLink href='mailto:jonasdevzero@gmail.com' rel="noopener noreferrer external nofollow">
                        E-mail
                    </StyledLink>
                </div>
                <div>
                    <h6>Legal</h6>

                    <Link href='/'>
                        <StyledLink>Terms</StyledLink>
                    </Link>
                    <Link href='/'>
                        <StyledLink>Privacy</StyledLink>
                    </Link>
                </div>
            </Content>

            <Credits>Created with <HeartIcon /> by JonasDevZero</Credits>
        </Container>
    )
}
