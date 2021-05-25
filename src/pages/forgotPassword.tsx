import Head from "next/head"
import Link from 'next/link'
import { useRouter } from "next/router"
import { useState } from "react"

import { Header, Footer } from '../components'
import {
    Container,
    InnerCenter,
    FitForm,
    FitFormTitle,
    InputWrapper,
    Label,
    Input,
    Submit,
    Links,
    RedirectLink
} from "../styles/pages/base"

export default function forgotPassword() {
    const [email, setEmail] = useState("")

    const [error, setError] = useState<string | undefined>("")
    const [successWarning, setSuccessWarning] = useState(undefined)
    const [loadingRequest, setLoadingRequest] = useState(false)

    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        //...
    }

    return (
        <Container>
            <Head>
                <title>Zero | Forgot Password</title>
            </Head>

            <Header />

            <InnerCenter>
                <FitForm onSubmit={handleSubmit}>
                    <FitFormTitle>Forgot Password</FitFormTitle>

                    <InputWrapper>
                        <Label htmlFor='email'>E-mail</Label>
                        <Input id='email' type='text' value={email} onChange={e => setEmail(e.target.value)} />
                    </InputWrapper>

                    <Submit type='submit'>Submit</Submit>

                    <Links>
                        <Link href='/signin'>
                            <RedirectLink>Remember your password?</RedirectLink>
                        </Link>
                    </Links>
                </FitForm>
            </InnerCenter>

            <Footer />
        </Container>
    )
}
