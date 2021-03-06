import Head from 'next/head'
import Link from 'next/link'
import { useEffect } from 'react'

import { Header, Footer } from '../components'
import {
    Container,
    Section,
    Presentation,
    SubscribeLink,
    KnowMore,
    Inner,
    Info,
    CallToActionCard,
    Features,
    Feature
} from '../styles/pages/home'
import { ButtonBase } from '@material-ui/core'
import {
    ExpandMore as ArrowDownIcon,
    Person as PersonIcon,
    Group as GroupIcon,
    Call as CallIcon,
    AttachFile as AttachFileIcon,
    Mic as MicIcon,
    Brightness7 as Brightness7Icon,
} from '@material-ui/icons'

export default function Home() {
    useEffect(() => {
        const elements = document.getElementsByClassName('onscroll__animate')
        const iterableElements: Element[] = []

        for (let i = 0; i < elements.length; i++) iterableElements.push(elements[i]);

        window.addEventListener('scroll', () => onScroll(iterableElements))
    }, [])

    function elementInView(el: Element) {
        const { top, left, bottom, right, height } = el.getBoundingClientRect()
        const { innerHeight, innerWidth } = window

        const inView = (
            top + (height / 2) >= 0
            && left >= 0
            && bottom <= (innerHeight + (height / 3))
            && right <= innerWidth
        )

        return inView
    }

    function onScroll(elements: Element[]) {
        for (const element of elements) {
            const containsClassName = element.classList.contains('in-view')

            if (elementInView(element)) {
                !containsClassName ? element.classList.add('in-view') : null
            } else if (containsClassName) {
                element.classList.remove('in-view')
            }
        }
    }

    return (
        <Container>
            <Head>
                <link href="https://fonts.googleapis.com/css2?family=Raleway&display=swap" rel="stylesheet" />
                <title>Zero Chat</title>
            </Head>

            <Header showLinks={true} />

            <Section>
                <Presentation>
                    <h3>A modern Web Chat</h3>

                    <Link href='/signup'>
                        <SubscribeLink>Start now!</SubscribeLink>
                    </Link>

                    <KnowMore>
                        <h4>Know More</h4>
                        <ButtonBase>
                            <ArrowDownIcon />
                        </ButtonBase>
                    </KnowMore>
                </Presentation>
            </Section>

            <Section className='bg'>
                <Inner>
                    <Info className='onscroll__animate'>
                        <h2>Simple and Fast</h2>

                        <p>Chat with your friends in a comfortable and realiable place.</p>
                    </Info>

                    <img className='onscroll__animate' src="/chat-baloons.svg" alt="" />
                </Inner>
            </Section>

            <Section>
                <Inner>
                    <Features className='onscroll__animate'>
                        <div className='row'>
                            <Feature>
                                <div>
                                    <PersonIcon fontSize='large' />
                                </div>
                                <span>Private chat</span>
                            </Feature>

                            <Feature>
                                <div>
                                    <GroupIcon fontSize='large' />
                                </div>
                                <span>Groups</span>
                            </Feature>

                            <Feature>
                                <div>
                                    <CallIcon fontSize='large' />
                                </div>
                                <span>Call voice/video</span>
                            </Feature>
                        </div>

                        <div className='row'>
                            <Feature>
                                <div>
                                    <AttachFileIcon className='rotate' fontSize='large' />
                                </div>
                                <span>Send files</span>
                            </Feature>

                            <Feature>
                                <div>
                                    <MicIcon fontSize='large' />
                                </div>
                                <span>Voice messages</span>
                            </Feature>

                            <Feature>
                                <div>
                                    <Brightness7Icon fontSize='large' />
                                </div>
                                <span>Themes</span>
                            </Feature>
                        </div>
                    </Features>

                    <Info className='onscroll__animate'>
                        <h2>Complete Chat Plataform</h2>
                        <p>Have a complete experience of a modern webchat.</p>
                    </Info>
                </Inner>
            </Section>

            <Section className='bg'>
                <CallToActionCard className='onscroll__animate'>
                    <h3>Let's Go!</h3>
                    <h3>Sign up now to chat with your friends</h3>

                    <Link href='/signup'>
                        <SubscribeLink>Subscribe Now!</SubscribeLink>
                    </Link>
                </CallToActionCard>
            </Section>

            <Footer />
        </Container>
    );
};
