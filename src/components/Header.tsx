import Link from 'next/link'

import {
    Container,
    Logo,
    StyledLink
} from '../styles/components/Header'

interface HeaderI {
    showLinks?: boolean
}

function Header({ showLinks }: HeaderI) {
    return (
        <Container>
            <Link href='/'>
                <Logo>Zero</Logo>
            </Link>

            {showLinks ? (
                <div>
                    <Link href='/signin'>
                        <StyledLink>Sign In</StyledLink>
                    </Link>
                    <Link href='/signup'>
                        <StyledLink>Sign Up</StyledLink>
                    </Link>
                </div>
            ) : null}
        </Container>
    )
}

export default Header
