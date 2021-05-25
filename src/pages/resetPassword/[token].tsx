import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"

import { Header, Footer } from '../../components'
import {
    Container,
    InnerCenter,
    FitForm,
    FitFormTitle,
    InputWrapper,
    Label,
    Input,
    Submit,
} from "../../styles/pages/base"

export default function forgotPassword() {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const router = useRouter()
    const { token } = router.query

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        //...
    }

    return (
        <Container>
            <Head>
                <title>Zero | Reset Password</title>
            </Head>

            <Header />

            <InnerCenter>
                <FitForm>
                    <FitFormTitle>Reset Password</FitFormTitle>

                    <InputWrapper>
                        <Label htmlFor='password'>Password</Label>
                        <Input id='password' type='password' value={password} onChange={e => setPassword(e.target.value)} />
                    </InputWrapper>

                    <InputWrapper>
                        <Label htmlFor='confirmPassword'>Confirm Password</Label>
                        <Input id='confirmPassword' type='password' value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                    </InputWrapper>

                    <Submit type='submit'>Submit</Submit>
                </FitForm>
            </InnerCenter>

            <Footer />
        </Container>
    )
}
